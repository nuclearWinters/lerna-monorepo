use std::{convert::Infallible, sync::{Arc, Mutex}, str, net::SocketAddr};
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema, Object, ID, Enum, Result, Context, SimpleObject, Scalar, ScalarType, InputValueResult, Value, InputValueError, futures_util::StreamExt, InputObject};
use async_graphql_warp::{GraphQLBadRequest, GraphQLResponse};
use http::StatusCode;
use serde_json::from_str;
use warp::{http::Response as HttpResponse, Filter, Rejection};
use mongodb::{Client, options::{ClientOptions, ServerApi, ServerApiVersion, FindOneOptions, UpdateOptions, FindOptions}, bson::{doc, oid::ObjectId, DateTime}, Collection};
use serde::{Deserialize, Serialize};
use base64::{engine::{general_purpose, GeneralPurpose}, Engine as _, alphabet};
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};
use woothee::parser::Parser;
use std::time::{SystemTime, UNIX_EPOCH};
use cookie::{Cookie, time::OffsetDateTime};
use redis::{Commands, Client as RedisClient, Connection as RedisConnection};

struct DateScalarType(DateTime);

#[Scalar]
impl ScalarType for DateScalarType {
    fn parse(value: Value) -> InputValueResult<Self> {
        if let Value::Number(value) = &value {
            Ok(DateScalarType(DateTime::from_millis(value.as_i64().unwrap())))
        } else {
            Err(InputValueError::expected_type(value))
        }
    }

    fn to_value(&self) -> Value {
        Value::Number(self.0.timestamp_millis().into())
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    id: String,
    #[serde(rename(serialize = "isBorrower", deserialize = "isBorrower"))]
    is_borrower: bool,
    #[serde(rename(serialize = "isLender", deserialize = "isLender"))]
    is_lender: bool,
    #[serde(rename(serialize = "isSupport", deserialize = "isSupport"))]
    is_support: bool,
    #[serde(rename(serialize = "refreshTokenExpireTime", deserialize = "refreshTokenExpireTime"))]
    refresh_token_expire_time: i64,
    exp: i64,
}

const ACCESSSECRET: &str = "ACCESSSECRET";
const REFRESHSECRET: &str = "REFRESHSECRET";

struct Mutation;

#[derive(InputObject)]
struct SignInInput {
    password: String,
    email: String,
    client_mutation_id: Option<String>,
}

#[derive(SimpleObject)]
struct SignInPayload {
    error: String,
    client_mutation_id: Option<String>,
}

#[derive(InputObject)]
struct LogOutInput {
    client_mutation_id: Option<String>,
}

#[derive(SimpleObject)]
struct LogOutPayload {
    error: String,
    client_mutation_id: Option<String>,
}

#[Object]
impl Mutation {
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<SignInPayload> {
        let auth_users = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter = doc! { "email": input.email };
        let user = auth_users.find_one(filter, None).await?;
        match user {
            Some(user) => {
                let valid: bool = verify(input.password, &user.password)?;
                if !valid {
                    return Ok(SignInPayload {
                        error: String::from("La contraseña no coincide."),
                        client_mutation_id: None,
                    });
                }
                let con = ctx.data::<Arc<Mutex<RedisConnection>>>()?;
                let black_listed_user: redis::RedisResult<String> = con.lock().unwrap().get(user._id.to_hex());
                if black_listed_user.is_ok() {
                    return Ok(SignInPayload {
                        error: String::from("El usuario estará bloqueado."),
                        client_mutation_id: None,
                    });
                }
                let start: SystemTime = SystemTime::now();
                let since_the_epoch: i64 = start
                    .duration_since(UNIX_EPOCH)
                    .expect("Time went backwards")
                    .as_secs() as i64;
                let since_the_epoch_access: i64 = since_the_epoch + 180;
                let since_the_epoch_refresh: i64 = since_the_epoch + 900;
                let my_claims_refresh: Claims = Claims {
                    id: user.id.to_owned(),
                    is_borrower: user.is_borrower,
                    is_lender: user.is_lender,
                    is_support: user.is_support,
                    refresh_token_expire_time: since_the_epoch_refresh,
                    exp: since_the_epoch_refresh,
                };
                let my_claims_access: Claims = Claims {
                    id: user.id.to_owned(),
                    is_borrower: user.is_borrower,
                    is_lender: user.is_lender,
                    is_support: user.is_support,
                    refresh_token_expire_time: since_the_epoch_refresh,
                    exp: since_the_epoch_access,
                };
                let access_token: String = encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref()))?;
                let refresh_token: String = encode(&Header::default(), &my_claims_refresh, &EncodingKey::from_secret(REFRESHSECRET.as_ref()))?;
                ctx.append_http_header("accessToken", access_token);
                let now: OffsetDateTime = OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh).unwrap();
                let cookie: Cookie = Cookie::build("refreshToken", refresh_token).http_only(true).expires(now).finish();
                ctx.append_http_header("Set-Cookie", cookie.to_string());
                let auth_logins = ctx.data::<Collection<LoginsMongo>>()?;
                let auth_sessions = ctx.data::<Collection<SessionsMongo>>()?;
                let request_context = ctx.data::<RequestContext>()?;
                let new_login = LoginsMongo {
                    _id: ObjectId::new(),
                    application_name: String::from("Lerna Monorepo"),
                    address: request_context.ip.to_owned(),
                    time: DateTime::now(),
                    user_id: user.id.to_owned()
                };
                auth_logins.insert_one(new_login, None).await?;
                let update_one_options: UpdateOptions = UpdateOptions::builder().upsert(true).build();
                let parser = Parser::new();
                let result = parser.parse(request_context.user_agent.as_str());
                let mut device_name = String::from("");
                let mut device_type = String::from("");
                match result {
                    Some(result) => {
                        device_name.push_str(result.os);
                        device_name.push_str(" ");
                        device_name.push_str(&result.os_version);
                        device_type.push_str(result.category);
                        device_type.push_str(" ");
                        device_type.push_str(result.browser_type);
                        device_type.push_str(" ");
                        device_type.push_str(result.name);
                    },
                    None => {}
                }
                auth_sessions.update_one(
                    doc! { "sessionId": request_context.session_id.to_owned() },
                    doc! {
                        "$set": {
                            "lastTimeAccessed": DateTime::now()
                        },
                        "$setOnInsert": { 
                            "applicationName": "Lerna Monorepo",
                            "deviceName": device_name,
                            "sessionId": request_context.session_id.to_owned(),
                            "address": request_context.ip.to_owned(),
                            "userId": user.id.to_owned(),
                            "type": device_type
                        }
                    },
                    update_one_options
                ).await?;
                return Ok(SignInPayload {
                    error: String::from(""),
                    client_mutation_id: None,
                });
            },
            None => {
                return Ok(SignInPayload {
                    error: String::from("El usuario no existe."),
                    client_mutation_id: None,
                });
            }
        };
    }
    async fn log_out(&self, ctx: &Context<'_>, _input: LogOutInput) -> Result<LogOutPayload> {
        let cookie: Cookie = Cookie::build("refreshToken", "").http_only(true).expires(OffsetDateTime::now_utc()).finish();
        ctx.append_http_header("Set-Cookie", cookie.to_string());
        Ok(LogOutPayload {
            error: String::from(""),
            client_mutation_id: None,
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginsMongo {
    _id: ObjectId,
    #[serde(rename(serialize = "applicationName", deserialize = "applicationName"))]
    application_name: String,
    address: String,
    time: DateTime,
    #[serde(rename(serialize = "userId", deserialize = "userId"))]
    user_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionsMongo {
    _id: ObjectId,
    #[serde(rename(serialize = "sessionId", deserialize = "sessionId"))]
    session_id: String,
    #[serde(rename(serialize = "lastTimeAccessed", deserialize = "lastTimeAccessed"))]
    last_time_accessed: DateTime,
    #[serde(rename(serialize = "applicationName", deserialize = "applicationName"))]
    application_name: String,
    #[serde(rename(serialize = "deviceName", deserialize = "deviceName"))]
    device_name: String,
    address: String,
    #[serde(rename(serialize = "userId", deserialize = "userId"))]
    user_id: String,
    #[serde(rename(serialize = "type", deserialize = "type"))]
    device_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthUserMongo {
    _id: ObjectId,
    id: String,
    name: String,
    #[serde(rename(serialize = "apellidoPaterno", deserialize = "apellidoPaterno"))]
    apellido_paterno: String,
    #[serde(rename(serialize = "apellidoMaterno", deserialize = "apellidoMaterno"))]
    apellido_materno: String,
    #[serde(rename(serialize = "RFC", deserialize = "RFC"))]
    rfc: String,
    #[serde(rename(serialize = "CURP", deserialize = "CURP"))]
    curp: String,
    clabe: String,
    mobile: String,
    email: String,
    #[serde(rename(serialize = "isSupport", deserialize = "isSupport"))]
    is_support: bool,
    #[serde(rename(serialize = "isLender", deserialize = "isLender"))]
    is_lender: bool,
    #[serde(rename(serialize = "isBorrower", deserialize = "isBorrower"))]
    is_borrower: bool,
    language: Languages,
    password: String,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq, Debug, Serialize, Deserialize)]
pub enum Languages {
    #[graphql(name="EN")]
    en,
    #[graphql(name="DEFAULT")]
    es,
    #[graphql(name="DEFAULT")]
    default,
}

struct AuthUser {
    id: ID,
    account_id: String,
    name: String,
    apellido_paterno: String,
    apellido_materno: String,
    rfc: String,
    curp: String,
    clabe: String,
    mobile: String,
    email: String,
    is_support: bool,
    is_lender: bool,
    is_borrower: bool,
    language: Languages,
}

#[Object]
impl AuthUser {
    async fn id(&self) -> &ID {
        &self.id
    }
    async fn account_id(&self) -> &String {
        &self.account_id
    }
    async fn name(&self) -> &String {
        &self.name
    }
    async fn apellido_paterno(&self) -> &String {
        &self.apellido_paterno
    }
    async fn apellido_materno(&self) -> &String {
        &self.apellido_materno
    }
    #[graphql(name = "RFC")]
    async fn rfc(&self) -> &String {
        &self.rfc
    }
    #[graphql(name = "CURP")]
    async fn curp(&self) -> &String {
        &self.curp
    }
    async fn clabe(&self) -> &String {
        &self.clabe
    }
    async fn mobile(&self) -> &String {
        &self.mobile
    }
    async fn email(&self) -> &String {
        &self.email
    }
    async fn is_support(&self) -> bool {
        self.is_support
    }
    async fn is_lender(&self) -> bool {
        self.is_lender
    }
    async fn is_borrower(&self) -> bool {
        self.is_borrower
    }
    async fn language(&self) -> Languages {
        self.language
    }
    async fn sessions(&self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> Result<SessionsConnection> {
        let request_context = ctx.data::<RequestContext>()?;
        if request_context.id == String::from("") {
            return Ok(SessionsConnection {
                page_info: PageInfo {
                    has_next_page: false,
                    has_previous_page: false,
                    start_cursor: String::from(""),
                    end_cursor: String::from("")
                },
                edges: Vec::new()
            })
        }
        let auth_sessions = ctx.data::<Collection<SessionsMongo>>()?;
        let mut sessions_id = String::from("");
        match after {
            Some(after) => {
                let decoded_cursor = general_purpose::STANDARD.decode(&after);
                match decoded_cursor {
                    Ok(decoded_cursor) => {
                        let json_str = str::from_utf8(&decoded_cursor);
                        match json_str {
                            Ok(json_str) => {
                                let jwt_parts = json_str.split(":");
                                let mut index = 0;
                                for part in jwt_parts {
                                    if index == 1 {
                                        sessions_id = String::from(part);
                                    }
                                    index = index + 1;
                                }
                            }
                            Err(_json_str) => {}
                        }
                    },
                    Err(_decoded_cursor) => {}
                }
            },
            None => {}
        }
        let mut find_filter = doc! { "userId": request_context.id.to_owned() };
        if sessions_id != String::from("") {
            let object_id = ObjectId::parse_str(sessions_id).unwrap();
            find_filter = doc! { "_id": { "$lt": object_id } };
        }
        let limit: i64 = first.unwrap_or(0);
        let find_options: FindOptions = FindOptions::builder().limit(limit + 1).sort(doc! { "$natural": -1 }).build();
        let mut cursor: mongodb::Cursor<SessionsMongo> = auth_sessions.find(find_filter, find_options).await?;
        let mut sessions_edges: Vec<SessionsEdge> = Vec::<SessionsEdge>::new();
        while let Some(session_doc) = cursor.next().await {
            match session_doc {
                Ok(session_doc) => {
                    let mut cursor_string = "arrayconnection:".to_owned();
                    let hex = session_doc._id.to_hex();
                    cursor_string.push_str(&hex);
                    let mut node_id: String = "Session:".to_owned();
                    let hex = session_doc._id.to_hex();
                    node_id.push_str(&hex);
                    sessions_edges.push(SessionsEdge {
                        cursor: general_purpose::STANDARD.encode(cursor_string),
                        node: Session {
                            id: ID::from(general_purpose::STANDARD.encode(node_id)),
                            application_name: session_doc.application_name,
                            device_type: session_doc.device_type,
                            device_name: session_doc.device_name,
                            session_id: session_doc.session_id,
                            address: session_doc.address,
                            last_time_accessed: DateScalarType(session_doc.last_time_accessed),
                            user_id: session_doc.user_id,
                        }
                    });
                }
                Err(_session_doc) => {}
            }
        }
        let edge_index: usize = usize::try_from(limit).unwrap();
        let limit_edge: Option<&SessionsEdge> = sessions_edges.get(edge_index);
        let has_next_page: bool = match limit_edge {
            Some(_limit_edge) => true,
            None => false,
        };
        let first_element = sessions_edges.get(0);
        let start_cursor: String = match first_element {
            Some(first_element) => first_element.cursor.to_owned(),
            None => String::from(""),
        };
        let last_element = sessions_edges.get(edge_index - 1);
        let end_cursor: String = match last_element {
            Some(first_element) => first_element.cursor.to_owned(),
            None => String::from(""),
        };
        if has_next_page {
            sessions_edges.pop();
        }
        Ok(SessionsConnection {
            page_info: PageInfo {
                has_next_page,
                has_previous_page: false,
                start_cursor,
                end_cursor,
            },
            edges: sessions_edges
        })
    }
    async fn logins(&self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> Result<LoginsConnection> {
            let request_context = ctx.data::<RequestContext>()?;
            if request_context.id == String::from("") {
                return Ok(LoginsConnection {
                    page_info: PageInfo {
                        has_next_page: false,
                        has_previous_page: false,
                        start_cursor: String::from(""),
                        end_cursor: String::from("")
                    },
                    edges: Vec::new()
                })
            }
            let auth_logins = ctx.data::<Collection<LoginsMongo>>()?;
            let mut logins_id = String::from("");
            match after {
                Some(after) => {
                    let decoded_cursor = general_purpose::STANDARD.decode(&after);
                    match decoded_cursor {
                        Ok(decoded_cursor) => {
                            let json_str = str::from_utf8(&decoded_cursor);
                            match json_str {
                                Ok(json_str) => {
                                    let jwt_parts = json_str.split(":");
                                    let mut index = 0;
                                    for part in jwt_parts {
                                        if index == 1 {
                                            logins_id = String::from(part);
                                        }
                                        index = index + 1;
                                    }
                                }
                                Err(_json_str) => {}
                            }
                        },
                        Err(_decoded_cursor) => {}
                    }
                },
                None => {}
            }
            let mut find_filter = doc! { "userId": request_context.id.to_owned() };
            if logins_id != String::from("") {
                let object_id = ObjectId::parse_str(logins_id).unwrap();
                find_filter = doc! { "_id": { "$lt": object_id } };
            }
            let limit: i64 = first.unwrap_or(0);
            let find_options: FindOptions = FindOptions::builder().limit(limit + 1).sort(doc! { "$natural": -1 }).build();
            let mut cursor: mongodb::Cursor<LoginsMongo> = auth_logins.find(find_filter, find_options).await?;
            let mut logins_edges: Vec<LoginsEdge> = Vec::<LoginsEdge>::new();
            while let Some(login_doc) = cursor.next().await {
                match login_doc {
                    Ok(login_doc) => {
                        let mut cursor_string = "arrayconnection:".to_owned();
                        let hex = login_doc._id.to_hex();
                        cursor_string.push_str(&hex);
                        let mut node_id: String = "Login:".to_owned();
                        let hex = login_doc._id.to_hex();
                        node_id.push_str(&hex);
                        logins_edges.push(LoginsEdge {
                            cursor: general_purpose::STANDARD.encode(cursor_string),
                            node: Login {
                                id: ID::from(general_purpose::STANDARD.encode(node_id)),
                                application_name: login_doc.application_name,
                                time: DateScalarType(login_doc.time),
                                address: login_doc.address,
                                user_id: login_doc.user_id,
                            }
                        });
                    }
                    Err(_login_doc) => {}
                }
            }
            let edge_index: usize = usize::try_from(limit).unwrap();
            let limit_edge: Option<&LoginsEdge> = logins_edges.get(edge_index);
            let has_next_page: bool = match limit_edge {
                Some(_limit_edge) => true,
                None => false,
            };
            let first_element = logins_edges.get(0);
            let start_cursor: String = match first_element {
                Some(first_element) => first_element.cursor.to_owned(),
                None => String::from(""),
            };
            let last_element = logins_edges.get(edge_index - 1);
            let end_cursor: String = match last_element {
                Some(first_element) => first_element.cursor.to_owned(),
                None => String::from(""),
            };
            if has_next_page {
                logins_edges.pop();
            }
            Ok(LoginsConnection {
                page_info: PageInfo {
                    has_next_page,
                    has_previous_page: false,
                    start_cursor,
                    end_cursor,
                },
                edges: logins_edges
            })
    }
}

#[derive(SimpleObject)]
struct PageInfo {
    has_next_page: bool,
    has_previous_page: bool,
    start_cursor: String, 
    end_cursor: String,
}

#[derive(SimpleObject)]
struct Login {
    id: ID,
    application_name: String,
    time: DateScalarType,
    address: String,
    user_id: String,
}

#[derive(SimpleObject)]
struct LoginsEdge {
    cursor: String,
    node: Login,
}

#[derive(SimpleObject)]
struct LoginsConnection {
    page_info: PageInfo,
    edges: Vec<LoginsEdge>,
}

#[derive(SimpleObject)]
struct Session {
    id: ID,
    application_name: String,
    #[graphql(name = "type")]
    device_type: String,
    device_name: String,
    session_id: String,
    address: String,
    last_time_accessed: DateScalarType,
    user_id: String,
}

#[derive(SimpleObject)]
struct SessionsEdge {
    cursor: String,
    node: Session,
}

#[derive(SimpleObject)]
struct SessionsConnection {
    page_info: PageInfo,
    edges: Vec<SessionsEdge>,
}

struct Query;

#[Object]
impl Query {
  async fn auth_user(&self, ctx: &Context<'_>) -> Result<AuthUser> {
    let request_context = ctx.data::<RequestContext>()?;
    if request_context.id.to_owned() == String::from("") {
        let data = "AuthUser:000000000000000000000000";
        let no_user = AuthUser {
            id: ID::from(general_purpose::STANDARD.encode(data)),
            account_id: String::from(""),
            name: String::from(""),
            apellido_paterno: String::from(""),
            apellido_materno: String::from(""),
            rfc: String::from(""),
            curp: String::from(""),
            clabe: String::from(""),
            mobile: String::from(""),
            email: String::from(""),
            is_support: false,
            is_lender: true,
            is_borrower: false,
            language: Languages::default,
        };
        return Ok(no_user);
    }
    let auth_users = ctx.data::<Collection<AuthUserMongo>>()?;
    let filter = doc! { "id": request_context.id.to_owned() };
    let find_options = FindOneOptions::builder().build();
    let user = auth_users.find_one(filter, find_options).await?;
    match user {
        Some(user) => {
            let mut data = "AuthUser:".to_owned();
            let hex = user._id.to_hex();
            data.push_str(&hex);
            Ok(
                AuthUser {
                    id: ID::from(general_purpose::STANDARD.encode(data)),
                    account_id: user.id,
                    name: user.name,
                    apellido_paterno: user.apellido_paterno,
                    apellido_materno: user.apellido_materno,
                    rfc: user.rfc,
                    curp: user.curp,
                    clabe: user.clabe,
                    mobile: user.mobile,
                    email: user.email,
                    is_support: user.is_support,
                    is_lender: user.is_lender,
                    is_borrower: user.is_borrower,
                    language: user.language
                }
            )

        }
        None => {
            let data = "AuthUser:000000000000000000000000";
            let no_user = AuthUser {
                id: ID::from(general_purpose::STANDARD.encode(data)),
                account_id: String::from(""),
                name: String::from(""),
                apellido_paterno: String::from(""),
                apellido_materno: String::from(""),
                rfc: String::from(""),
                curp: String::from(""),
                clabe: String::from(""),
                mobile: String::from(""),
                email: String::from(""),
                is_support: false,
                is_lender: true,
                is_borrower: false,
                language: Languages::default,
            };
            return Ok(no_user);
        }
    }
  }
}

struct RequestContext {
    id: String,
    ip: String,
    session_id: String,
    user_agent: String,
}

#[tokio::main]
async fn main() -> mongodb::error::Result<()> {
    let uri = "mongodb://127.0.0.1:27017";
    let mut client_options =
        ClientOptions::parse(uri)
            .await?;
    let server_api: ServerApi = ServerApi::builder().version(ServerApiVersion::V1).build();
    client_options.server_api = Some(server_api);
    let client = Client::with_options(client_options)?;
    let db = client.database("auth");
    let auth_users: Collection<AuthUserMongo> = db.collection::<AuthUserMongo>("users");
    let auth_sessions: Collection<SessionsMongo> = db.collection::<SessionsMongo>("sessions");
    let auth_logins: Collection<LoginsMongo> = db.collection::<LoginsMongo>("logins");
    let redis_client = RedisClient::open("redis://127.0.0.1/").unwrap();
    let redis_connection = redis_client.get_connection().unwrap();
    let schema: Schema<Query, Mutation, EmptySubscription> = Schema::build(Query, Mutation, EmptySubscription)
        .data(auth_users)
        .data(auth_sessions)
        .data(auth_logins)
        .data(Arc::new(Mutex::new(redis_connection)))
        .finish();

    println!("GraphiQL IDE: http://localhost:8001");

    let graphql_post = async_graphql_warp::graphql(schema)
    .and(warp::header::optional::<String>("Authorization"))
    .and(warp::filters::addr::remote())
    .and(warp::filters::cookie::optional::<String>("sessionId"))
    .and(warp::header::optional::<String>("User-Agent"))
    .and_then(
        |(schema, request): (
            Schema<Query, Mutation, EmptySubscription>,
            async_graphql::Request,
        ), auth: Option<String>, ip: Option<SocketAddr>, session_id: Option<String>, user_agent: Option<String>| async move {
            let mut request_context = RequestContext {
                id: String::from(""),
                ip:  String::from(""),
                session_id: session_id.unwrap_or(String::from("")),
                user_agent: user_agent.unwrap_or(String::from("")),
            };
            match ip {
                Some(ip) => {
                    request_context.ip = ip.to_string();
                },
                None => {}
            }
            match auth {
                Some(auth) => {
                    let jwt_parts = auth.as_str().split(".");
                    let mut index = 0;
                    for part in jwt_parts {
                        if index == 1 {
                            let json_vec = GeneralPurpose::new(
                                &alphabet::URL_SAFE,
                                general_purpose::NO_PAD
                            ).decode(part);
                            match json_vec {
                                Ok(json_vec) => {
                                    let json_str = str::from_utf8(&json_vec);
                                    match json_str {
                                        Ok(json_str) => {
                                            let json_serde: Result<Claims, serde_json::Error> = from_str(json_str);
                                            match json_serde {
                                                Ok(json_serde) => {
                                                    request_context.id = json_serde.id
                                                },
                                                Err(_json_serde) => {}
                                            }
                                        }
                                        Err(_json_str) => {}
                                    }
                                },
                                Err(_json_vec) => {}
                            }
                        };
                        index = index + 1;
                    }
                },
                None => {}
            }
            let response = schema
                .execute(
                  request
                   .data(request_context)
                ).await;
            Ok::<_, Infallible>(GraphQLResponse::from(response))
        },
    );

    let graphiql = warp::path::end().and(warp::get()).map(|| {
        HttpResponse::builder()
            .header("content-type", "text/html")
            .body(GraphiQLSource::build().endpoint("/").finish())
    });

    let routes = graphiql
        .or(graphql_post)
        .recover(|err: Rejection| async move {
            if let Some(GraphQLBadRequest(err)) = err.find() {
                return Ok::<_, Infallible>(warp::reply::with_status(
                    err.to_string(),
                    StatusCode::BAD_REQUEST,
                ));
            }

            Ok(warp::reply::with_status(
                "INTERNAL_SERVER_ERROR".to_string(),
                StatusCode::INTERNAL_SERVER_ERROR,
            ))
        });

    warp::serve(routes).run(([127, 0, 0, 1], 8001)).await;
    Ok(())
}