use account::{account_client::AccountClient, CreateUserInput};
use async_graphql::{
    futures_util::StreamExt, Context, EmptySubscription, Enum, InputObject, InputValueError,
    InputValueResult, Object, Request, Result as GraphQLResult, Scalar, ScalarType, Schema,
    SimpleObject, Value, ID,
};
use async_graphql_axum::GraphQLRequest;
use axum::{
    body::Body,
    extract::ConnectInfo,
    http::{
        header::{AUTHORIZATION, CONTENT_TYPE},
        HeaderMap, HeaderValue, Method, Response as AxumResponse, StatusCode,
    },
    response::{
        sse::{Event, Sse},
        IntoResponse,
    },
    routing::{get, post},
    Extension, Router,
};
use axum_extra::{headers, TypedHeader};
use axum_server::tls_rustls::RustlsConfig;
use base64::{
    alphabet,
    engine::{general_purpose, GeneralPurpose},
    Engine as _,
};
use bcrypt::{hash, verify, DEFAULT_COST};
use cookie::{time::OffsetDateTime, Cookie};
use futures::stream;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime, Document},
    options::{ClientOptions, ReturnDocument, ServerApi, ServerApiVersion},
    Client, Collection, Cursor, Database,
};
use redis::{Client as RedisClient, Commands, Connection as RedisConnection, RedisResult};
use serde::{Deserialize, Serialize};
use std::{
    convert::Infallible,
    fs,
    io::{Error, ErrorKind},
    net::SocketAddr,
    path::PathBuf,
    str::{self, FromStr},
    sync::Arc,
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tokio::sync::{Mutex, MutexGuard};
use tonic::transport::{Certificate, Channel, ClientTlsConfig, Identity};
use tower_http::cors::CorsLayer;
use uuid::Uuid;
use woothee::parser::{Parser, WootheeResult};

pub mod account {
    tonic::include_proto!("account_package");
}
use async_graphql::ErrorExtensions;

struct Date(DateTime);

#[Scalar]
impl ScalarType for Date {
    fn parse(value: Value) -> InputValueResult<Self> {
        if let Value::Number(value) = &value {
            match value.as_i64() {
                Some(value) => Ok(Date(DateTime::from_millis(value))),
                None => Ok(Date(DateTime::from_millis(0))),
            }
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
    #[serde(rename(
        serialize = "refreshTokenExpireTime",
        deserialize = "refreshTokenExpireTime"
    ))]
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

#[derive(InputObject)]
struct SignUpInput {
    client_mutation_id: Option<String>,
    password: String,
    email: String,
    is_lender: bool,
    language: Languages,
}

#[derive(SimpleObject)]
struct SignUpPayload {
    error: String,
    client_mutation_id: Option<String>,
}

#[derive(InputObject)]
struct UpdateUserInput {
    client_mutation_id: Option<String>,
    name: String,
    apellido_materno: String,
    apellido_paterno: String,
    #[graphql(name = "RFC")]
    rfc: String,
    #[graphql(name = "CURP")]
    curp: String,
    clabe: String,
    mobile: String,
    email: String,
    language: Languages,
}

#[derive(SimpleObject)]
struct UpdateUserPayload {
    error: String,
    client_mutation_id: Option<String>,
    auth_user: Option<AuthUser>,
}

#[derive(InputObject)]
struct ExtendSessionInput {
    client_mutation_id: Option<String>,
}

#[derive(SimpleObject)]
struct ExtendSessionPayload {
    error: String,
    client_mutation_id: Option<String>,
}

#[derive(InputObject)]
struct RevokeSessionInput {
    client_mutation_id: Option<String>,
    session_id: ID,
}

#[derive(SimpleObject)]
struct RevokeSessionPayload {
    error: String,
    client_mutation_id: Option<String>,
    session: Option<Session>,
    should_reload_browser: bool,
}

#[Object]
impl Mutation {
    async fn sign_in(
        &self,
        ctx: &Context<'_>,
        input: SignInInput,
    ) -> GraphQLResult<Option<SignInPayload>> {
        let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter: Document = doc! { "email": input.email };
        let user: Option<AuthUserMongo> = auth_users.find_one(filter).await?;
        Ok(match user {
            Some(user) => {
                let valid: bool = verify(input.password, &user.password)?;
                match valid {
                    true => {
                        let mut con: tokio::sync::MutexGuard<RedisConnection> =
                            ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                        let id: String = user.id;
                        let black_listed_user: RedisResult<String> = con.get(id.to_owned());
                        match black_listed_user {
                            Ok(_black_listed_user) => Some(SignInPayload {
                                error: String::from("User is suspended"),
                                client_mutation_id: None,
                            }),
                            Err(_err) => {
                                let start: SystemTime = SystemTime::now();
                                let since_the_epoch: i64 = start
                                    .duration_since(UNIX_EPOCH)
                                    .expect("Time went backwards")
                                    .as_secs()
                                    as i64;
                                let since_the_epoch_access: i64 = since_the_epoch + 180;
                                let since_the_epoch_refresh: i64 = since_the_epoch + 900;
                                let my_claims_refresh: Claims = Claims {
                                    id: id.to_owned(),
                                    is_borrower: user.is_borrower,
                                    is_lender: user.is_lender,
                                    is_support: user.is_support,
                                    refresh_token_expire_time: since_the_epoch_refresh,
                                    exp: since_the_epoch_refresh,
                                };
                                let my_claims_access: Claims = Claims {
                                    id: id.to_owned(),
                                    is_borrower: user.is_borrower,
                                    is_lender: user.is_lender,
                                    is_support: user.is_support,
                                    refresh_token_expire_time: since_the_epoch_refresh,
                                    exp: since_the_epoch_access,
                                };
                                let access_token: String = encode(
                                    &Header::default(),
                                    &my_claims_access,
                                    &EncodingKey::from_secret(ACCESSSECRET.as_ref()),
                                )?;
                                let refresh_token: String = encode(
                                    &Header::default(),
                                    &my_claims_refresh,
                                    &EncodingKey::from_secret(REFRESHSECRET.as_ref()),
                                )?;
                                ctx.append_http_header("accessToken", access_token);
                                match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh) {
                                    Ok(now) => {
                                        let cookie: String = Cookie::build((
                                            "refreshToken",
                                            refresh_token.to_owned(),
                                        ))
                                        .http_only(true)
                                        .expires(now)
                                        .secure(true)
                                        .same_site(cookie::SameSite::None)
                                        .to_string();
                                        ctx.append_http_header("Set-Cookie", cookie.to_string());
                                        let auth_logins: &Collection<LoginsMongo> =
                                            ctx.data::<Collection<LoginsMongo>>()?;
                                        let auth_sessions: &Collection<SessionsMongo> =
                                            ctx.data::<Collection<SessionsMongo>>()?;
                                        let request_context: &RequestContext =
                                            ctx.data::<RequestContext>()?;
                                        let new_login: LoginsMongo = LoginsMongo {
                                            _id: ObjectId::new(),
                                            application_name: String::from("Lerna Monorepo"),
                                            address: request_context.ip.to_owned(),
                                            time: DateTime::now(),
                                            user_id: id.to_owned(),
                                        };
                                        auth_logins.insert_one(new_login).await?;
                                        let parser: Parser = Parser::new();
                                        let result: Option<WootheeResult> =
                                            parser.parse(request_context.user_agent.as_str());
                                        let mut device_os: String = String::from("");
                                        let mut device_browser: String = String::from("");
                                        match result {
                                            Some(result) => {
                                                device_os.push_str(result.os);
                                                device_os.push_str(" ");
                                                device_os.push_str(&result.os_version);
                                                device_browser.push_str(result.category);
                                                device_browser.push_str(" ");
                                                device_browser.push_str(result.name);
                                                device_browser.push_str(" ");
                                                device_browser.push_str(result.version);
                                                device_browser.push_str(" ");
                                                device_browser.push_str(result.vendor);
                                            }
                                            None => {}
                                        }
                                        auth_sessions
                                            .insert_one(SessionsMongo {
                                                _id: ObjectId::new(),
                                                refresh_token: refresh_token.to_owned(),
                                                last_time_accessed: DateTime::now(),
                                                application_name: String::from("Lerna Monorepo"),
                                                device_os,
                                                address: request_context.ip.to_owned(),
                                                user_id: id.to_owned(),
                                                device_browser,
                                                expiration_date: DateTime::from_millis(
                                                    since_the_epoch_refresh * 1000,
                                                ),
                                            })
                                            .await?;
                                        Some(SignInPayload {
                                            error: String::from(""),
                                            client_mutation_id: None,
                                        })
                                    }
                                    Err(_err) => Some(SignInPayload {
                                        error: String::from("Tiempo unix no valido."),
                                        client_mutation_id: None,
                                    }),
                                }
                            }
                        }
                    }
                    false => Some(SignInPayload {
                        error: String::from("Incorrect password"),
                        client_mutation_id: None,
                    }),
                }
            }
            None => Some(SignInPayload {
                error: String::from("User do not exists"),
                client_mutation_id: None,
            }),
        })
    }
    async fn log_out(
        &self,
        ctx: &Context<'_>,
        _input: LogOutInput,
    ) -> GraphQLResult<Option<LogOutPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        let cookie: String = Cookie::build(("refreshToken", ""))
            .http_only(true)
            .expires(OffsetDateTime::now_utc())
            .secure(true)
            .same_site(cookie::SameSite::None)
            .to_string();
        ctx.append_http_header("Set-Cookie", cookie.to_string());
        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
        let start: SystemTime = SystemTime::now();
        let since_the_epoch: i64 = start
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as i64;
        let since_the_epoch_refresh: i64 = since_the_epoch - 900;
        let result: Option<SessionsMongo> = auth_sessions
            .find_one_and_update(
                doc! { "refresh_token": request_context.refresh_token.to_owned() },
                doc! {
                    "$set": {
                        "expiration_date": DateTime::from_millis(since_the_epoch_refresh * 1000)
                    }
                },
            )
            .await?;
        Ok(match result {
            Some(result) => {
                let mut con: MutexGuard<RedisConnection> =
                    ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                let _set: () = con.set(result.refresh_token.as_str(), since_the_epoch)?;
                let _expire: () = con.expire(result.refresh_token.as_str(), 15 * 60)?;
                Some(LogOutPayload {
                    error: String::from(""),
                    client_mutation_id: None,
                })
            }
            None => Some(LogOutPayload {
                error: String::from(""),
                client_mutation_id: None,
            }),
        })
    }
    async fn sign_up(
        &self,
        ctx: &Context<'_>,
        input: SignUpInput,
    ) -> GraphQLResult<Option<SignUpPayload>> {
        let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter: Document = doc! { "email": input.email.to_owned() };
        let user: Option<AuthUserMongo> = auth_users.find_one(filter).await?;
        Ok(match user {
            Some(_user) => Some(SignUpPayload {
                error: String::from("Email already in use"),
                client_mutation_id: None,
            }),
            None => {
                let hash_password: String = hash(input.password, DEFAULT_COST)?;
                let id = Uuid::new_v4().to_string();
                auth_users
                    .insert_one(AuthUserMongo {
                        _id: ObjectId::new(),
                        id: id.to_owned(),
                        password: hash_password,
                        apellido_materno: String::from(""),
                        apellido_paterno: String::from(""),
                        is_support: false,
                        is_borrower: !input.is_lender,
                        is_lender: input.is_lender,
                        name: String::from(""),
                        rfc: String::from(""),
                        curp: String::from(""),
                        clabe: String::from(""),
                        mobile: String::from(""),
                        email: input.email.to_owned(),
                        language: input.language,
                    })
                    .await?;
                let start: SystemTime = SystemTime::now();
                let since_the_epoch: i64 = start
                    .duration_since(UNIX_EPOCH)
                    .expect("Time went backwards")
                    .as_secs() as i64;
                let since_the_epoch_access: i64 = since_the_epoch + 180;
                let since_the_epoch_refresh: i64 = since_the_epoch + 900;
                let my_claims_refresh: Claims = Claims {
                    id: id.to_owned(),
                    is_borrower: !input.is_lender,
                    is_lender: input.is_lender,
                    is_support: false,
                    refresh_token_expire_time: since_the_epoch_refresh,
                    exp: since_the_epoch_refresh,
                };
                let my_claims_access: Claims = Claims {
                    id: id.to_owned(),
                    is_borrower: !input.is_lender,
                    is_lender: input.is_lender,
                    is_support: false,
                    refresh_token_expire_time: since_the_epoch_refresh,
                    exp: since_the_epoch_access,
                };
                let access_token: String = encode(
                    &Header::default(),
                    &my_claims_access,
                    &EncodingKey::from_secret(ACCESSSECRET.as_ref()),
                )?;
                let refresh_token: String = encode(
                    &Header::default(),
                    &my_claims_refresh,
                    &EncodingKey::from_secret(REFRESHSECRET.as_ref()),
                )?;
                ctx.append_http_header("accessToken", access_token);
                match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh) {
                    Ok(now) => {
                        let cookie: String =
                            Cookie::build(("refreshToken", refresh_token.to_owned()))
                                .http_only(true)
                                .expires(now)
                                .secure(true)
                                .same_site(cookie::SameSite::None)
                                .to_string();
                        ctx.append_http_header("Set-Cookie", cookie.to_string());
                        let auth_logins: &Collection<LoginsMongo> =
                            ctx.data::<Collection<LoginsMongo>>()?;
                        let auth_sessions: &Collection<SessionsMongo> =
                            ctx.data::<Collection<SessionsMongo>>()?;
                        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
                        let new_login: LoginsMongo = LoginsMongo {
                            _id: ObjectId::new(),
                            application_name: String::from("Lerna Monorepo"),
                            address: request_context.ip.to_owned(),
                            time: DateTime::now(),
                            user_id: id.to_owned(),
                        };
                        auth_logins.insert_one(new_login).await?;
                        let parser = Parser::new();
                        let result: Option<WootheeResult> =
                            parser.parse(request_context.user_agent.as_str());
                        let mut device_os: String = String::from("");
                        let mut device_browser: String = String::from("");
                        match result {
                            Some(result) => {
                                device_os.push_str(result.os);
                                device_os.push_str(" ");
                                device_os.push_str(&result.os_version);
                                device_browser.push_str(result.category);
                                device_browser.push_str(" ");
                                device_browser.push_str(result.name);
                                device_browser.push_str(" ");
                                device_browser.push_str(result.version);
                                device_browser.push_str(" ");
                                device_browser.push_str(result.vendor);
                            }
                            None => {}
                        }
                        auth_sessions
                            .insert_one(SessionsMongo {
                                _id: ObjectId::new(),
                                refresh_token: refresh_token.to_owned(),
                                last_time_accessed: DateTime::now(),
                                application_name: String::from("Lerna Monorepo"),
                                device_os,
                                address: request_context.ip.to_owned(),
                                user_id: id.to_owned(),
                                device_browser,
                                expiration_date: DateTime::from_millis(
                                    since_the_epoch_refresh * 1000,
                                ),
                            })
                            .await?;
                        let mut grpc_client = ctx
                            .data::<Arc<Mutex<AccountClient<Channel>>>>()?
                            .lock()
                            .await;
                        let request = tonic::Request::new(CreateUserInput { id: id.to_owned() });
                        grpc_client.create_user(request).await?;
                        Some(SignUpPayload {
                            error: String::from(""),
                            client_mutation_id: None,
                        })
                    }
                    Err(_err) => Some(SignUpPayload {
                        error: String::from("Tiempo unix no valido."),
                        client_mutation_id: None,
                    }),
                }
            }
        })
    }
    async fn update_user(
        &self,
        ctx: &Context<'_>,
        input: UpdateUserInput,
    ) -> GraphQLResult<Option<UpdateUserPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Ok(Some(UpdateUserPayload {
                error: String::from("No valid access token."),
                client_mutation_id: None,
                auth_user: None,
            }));
        }
        let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter: Document = doc! { "email": input.email.to_owned() };
        let user: Option<AuthUserMongo> = auth_users
            .find_one_and_update(
                filter,
                doc! {
                    "name": input.name,
                    "apellido_materno": input.apellido_materno,
                    "apellido_paterno": input.apellido_paterno,
                    "RFC": input.rfc,
                    "CURP": input.curp,
                    "clabe": input.clabe,
                    "mobile": input.mobile,
                    "email": input.email,
                    "language": input.language.to_string(),
                },
            )
            .return_document(ReturnDocument::After)
            .await?;
        Ok(match user {
            Some(user) => {
                let mut node_id: String = "AuthUser:".to_owned();
                let hex: String = user.id;
                node_id.push_str(&hex);
                Some(UpdateUserPayload {
                    error: String::from(""),
                    client_mutation_id: None,
                    auth_user: Some(AuthUser {
                        id: ID::from(general_purpose::STANDARD.encode(node_id)),
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
                        language: user.language,
                    }),
                })
            }
            None => Some(UpdateUserPayload {
                error: String::from("No user found."),
                client_mutation_id: None,
                auth_user: None,
            }),
        })
    }
    async fn extend_session(
        &self,
        ctx: &Context<'_>,
        _input: ExtendSessionInput,
    ) -> GraphQLResult<Option<ExtendSessionPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() || request_context.refresh_token.is_empty() {
            return Ok(Some(ExtendSessionPayload {
                error: String::from("No valid access token."),
                client_mutation_id: None,
            }));
        }
        let token: TokenData<Claims> = match decode::<Claims>(
            request_context.refresh_token.as_str(),
            &DecodingKey::from_secret(REFRESHSECRET.as_ref()),
            &Validation::default(),
        ) {
            Ok(data) => data,
            Err(_err) => {
                return Ok(Some(ExtendSessionPayload {
                    error: String::from("User do not exists"),
                    client_mutation_id: None,
                }))
            }
        };
        let mut con: MutexGuard<RedisConnection> =
            ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
        let black_listed_user: RedisResult<i64> = con.get(request_context.refresh_token.to_owned());
        match black_listed_user {
            Ok(black_listed_user) => {
                let time: i64 = black_listed_user * 1000;
                let issued_time: i64 = token.claims.exp * 1000;
                if time > issued_time {
                    return Ok(Some(ExtendSessionPayload {
                        error: String::from("El usuario esta bloqueado."),
                        client_mutation_id: None,
                    }));
                }
            }
            Err(_black_listed_user) => {}
        }
        let start: SystemTime = SystemTime::now();
        let since_the_epoch: i64 = start
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as i64;
        let since_the_epoch_access: i64 = since_the_epoch + 180;
        let since_the_epoch_refresh: i64 = since_the_epoch + 900;
        let my_claims_refresh: Claims = Claims {
            id: token.claims.id.to_owned(),
            is_borrower: token.claims.is_borrower,
            is_lender: token.claims.is_lender,
            is_support: token.claims.is_support,
            refresh_token_expire_time: since_the_epoch_refresh,
            exp: since_the_epoch_refresh,
        };
        let my_claims_access: Claims = Claims {
            id: token.claims.id.to_owned(),
            is_borrower: token.claims.is_borrower,
            is_lender: token.claims.is_lender,
            is_support: token.claims.is_support,
            refresh_token_expire_time: since_the_epoch_refresh,
            exp: since_the_epoch_access,
        };
        let access_token: String = encode(
            &Header::default(),
            &my_claims_access,
            &EncodingKey::from_secret(ACCESSSECRET.as_ref()),
        )?;
        let refresh_token: String = encode(
            &Header::default(),
            &my_claims_refresh,
            &EncodingKey::from_secret(REFRESHSECRET.as_ref()),
        )?;
        ctx.append_http_header("accessToken", access_token);
        let now: OffsetDateTime = match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh)
        {
            Ok(now) => now,
            Err(_err) => {
                return Ok(Some(ExtendSessionPayload {
                    error: String::from("Tiempo unix no valido."),
                    client_mutation_id: None,
                }));
            }
        };
        let cookie: String = Cookie::build(("refreshToken", refresh_token))
            .http_only(true)
            .expires(now)
            .secure(true)
            .same_site(cookie::SameSite::None)
            .to_string();
        ctx.append_http_header("Set-Cookie", cookie);
        Ok(Some(ExtendSessionPayload {
            error: String::from(""),
            client_mutation_id: None,
        }))
    }
    async fn revoke_session(
        &self,
        ctx: &Context<'_>,
        input: RevokeSessionInput,
    ) -> GraphQLResult<Option<RevokeSessionPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Ok(Some(RevokeSessionPayload {
                error: String::from("No valid access token."),
                client_mutation_id: None,
                should_reload_browser: false,
                session: None,
            }));
        }
        let start: SystemTime = SystemTime::now();
        let since_the_epoch: i64 = start
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as i64;
        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
        let result: Option<SessionsMongo> = auth_sessions.find_one_and_update(
            doc! { "_id": ObjectId::from_str(input.session_id.as_str()).unwrap() },
            doc! { "$set": { "expiration_date": DateTime::from_millis((since_the_epoch - 900) * 1000) }},
        ).return_document(ReturnDocument::After).await?;
        Ok(match result {
            Some(result) => {
                let mut con: MutexGuard<RedisConnection> =
                    ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                let _set: () = con.set(request_context.refresh_token.as_str(), since_the_epoch)?;
                let _expire: () = con.expire(request_context.refresh_token.as_str(), 15 * 60)?;
                match request_context.refresh_token == result.refresh_token {
                    true => {
                        let cookie: String = Cookie::build(("refreshToken", ""))
                            .http_only(true)
                            .expires(OffsetDateTime::now_utc())
                            .secure(true)
                            .same_site(cookie::SameSite::None)
                            .to_string();
                        ctx.append_http_header("Set-Cookie", cookie);
                        Some(RevokeSessionPayload {
                            error: String::from(""),
                            client_mutation_id: None,
                            should_reload_browser: true,
                            session: Some(Session {
                                id: ID::from(result._id.to_hex()),
                                application_name: result.application_name.to_owned(),
                                device_os: result.device_os,
                                device_browser: result.device_browser,
                                address: result.address,
                                last_time_accessed: Date(result.last_time_accessed),
                                user_id: result.user_id,
                                expiration_date: Date(result.expiration_date),
                            }),
                        })
                    }
                    false => Some(RevokeSessionPayload {
                        error: String::from(""),
                        client_mutation_id: None,
                        should_reload_browser: false,
                        session: Some(Session {
                            id: ID::from(result._id.to_hex()),
                            application_name: result.application_name,
                            device_os: result.device_os,
                            device_browser: result.device_browser,
                            address: result.address,
                            last_time_accessed: Date(result.last_time_accessed),
                            user_id: result.user_id,
                            expiration_date: Date(result.expiration_date),
                        }),
                    }),
                }
            }
            None => Some(RevokeSessionPayload {
                error: String::from("Mongo error."),
                client_mutation_id: None,
                should_reload_browser: false,
                session: None,
            }),
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
    #[serde(rename(serialize = "refreshToken", deserialize = "refreshToken"))]
    refresh_token: String,
    #[serde(rename(serialize = "lastTimeAccessed", deserialize = "lastTimeAccessed"))]
    last_time_accessed: DateTime,
    #[serde(rename(serialize = "applicationName", deserialize = "applicationName"))]
    application_name: String,
    #[serde(rename(serialize = "deviceBrowser", deserialize = "deviceBrowser"))]
    device_browser: String,
    address: String,
    #[serde(rename(serialize = "userId", deserialize = "userId"))]
    user_id: String,
    #[serde(rename(serialize = "deviceOS", deserialize = "deviceOS"))]
    device_os: String,
    #[serde(rename(serialize = "expirationDate", deserialize = "expirationDate"))]
    expiration_date: DateTime,
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
    #[graphql(name = "EN")]
    En,
    #[graphql(name = "ES")]
    Es,
    #[graphql(name = "DEFAULT")]
    Default,
}

impl Languages {
    fn to_string(&self) -> String {
        match self {
            Languages::Default => String::from("default"),
            Languages::En => String::from("en"),
            Languages::Es => String::from("es"),
        }
    }
}

struct AuthUser {
    id: ID,
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
    async fn sessions(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> GraphQLResult<SessionsConnection> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Err(
                Error::new(ErrorKind::InvalidInput, "Unauthenticated").extend_with(|_, _e| {})
            );
        }
        let first: i64 = match first {
            Some(first) => first,
            None => 0,
        };
        if first == 0 {
            return Err(Error::new(
                ErrorKind::InvalidInput,
                "Se requiere que 'first' sea un entero positivo",
            )
            .extend_with(|_, _e| {}));
        }
        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
        let sessions_id: String = match after {
            Some(after) => match general_purpose::STANDARD.decode(&after) {
                Ok(decoded_cursor) => match str::from_utf8(&decoded_cursor) {
                    Ok(json_str) => {
                        let mut iter = json_str.split(":");
                        iter.next();
                        match iter.next() {
                            Some(part) => String::from(part),
                            None => String::from(""),
                        }
                    }
                    Err(_json_str) => String::from(""),
                },
                Err(_decoded_cursor) => String::from(""),
            },
            None => String::from(""),
        };
        let mut find_filter: Document = doc! { "userId": request_context.id.to_owned() };
        if !sessions_id.is_empty() {
            match ObjectId::parse_str(sessions_id) {
                Ok(object_id) => {
                    find_filter.insert("_id", doc! { "$lt": object_id });
                }
                Err(_err) => {}
            };
        }
        let mut cursor: Cursor<SessionsMongo> = auth_sessions
            .find(find_filter)
            .limit(first)
            .sort(doc! { "$natural": -1 })
            .await?;
        let mut start_cursor: Option<String> = None;
        let mut end_cursor: Option<String> = None;
        let mut sessions_edges: Vec<Option<SessionsEdge>> = Vec::<Option<SessionsEdge>>::new();
        while let Some(session_doc) = cursor.next().await {
            match session_doc {
                Ok(session_doc) => {
                    let mut cursor_string: String = "arrayconnection:".to_owned();
                    let hex: String = session_doc._id.to_hex();
                    cursor_string.push_str(&hex);
                    let mut node_id: String = "Session:".to_owned();
                    let hex: String = session_doc._id.to_hex();
                    node_id.push_str(&hex);
                    let cursor = general_purpose::STANDARD.encode(cursor_string);
                    end_cursor = Some(cursor.to_owned());
                    if start_cursor.is_none() {
                        start_cursor = Some(cursor.to_owned());
                    }
                    sessions_edges.push(Some(SessionsEdge {
                        cursor: cursor.to_owned(),
                        node: Some(Session {
                            id: ID::from(general_purpose::STANDARD.encode(node_id)),
                            application_name: session_doc.application_name,
                            device_os: session_doc.device_os,
                            device_browser: session_doc.device_browser,
                            address: session_doc.address,
                            last_time_accessed: Date(session_doc.last_time_accessed),
                            user_id: session_doc.user_id,
                            expiration_date: Date(session_doc.expiration_date),
                        }),
                    }));
                }
                Err(_session_doc) => {}
            }
        }
        let has_next_page = cursor.advance().await?;
        Ok(SessionsConnection {
            page_info: PageInfo {
                has_next_page,
                has_previous_page: false,
                start_cursor,
                end_cursor,
            },
            edges: Some(sessions_edges),
        })
    }
    async fn logins(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> GraphQLResult<LoginsConnection> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Err(
                Error::new(ErrorKind::InvalidInput, "Unauthenticated").extend_with(|_, _e| {})
            );
        }
        let first: i64 = match first {
            Some(first) => first,
            None => 0,
        };
        if first == 0 {
            return Err(Error::new(
                ErrorKind::InvalidInput,
                "Se requiere que 'first' sea un entero positivo",
            )
            .extend_with(|_, _e| {}));
        }
        let mut start_cursor: Option<String> = None;
        let mut end_cursor: Option<String> = None;
        let auth_logins: &Collection<LoginsMongo> = ctx.data::<Collection<LoginsMongo>>()?;
        let logins_id: String = match after {
            Some(after) => match general_purpose::STANDARD.decode(&after) {
                Ok(decoded_cursor) => match str::from_utf8(&decoded_cursor) {
                    Ok(json_str) => {
                        let mut iter = json_str.split(":");
                        iter.next();
                        match iter.next() {
                            Some(part) => String::from(part),
                            None => String::from(""),
                        }
                    }
                    Err(_json_str) => String::from(""),
                },
                Err(_decoded_cursor) => String::from(""),
            },
            None => String::from(""),
        };
        let mut find_filter: Document = doc! { "userId": request_context.id.to_owned() };
        if !logins_id.is_empty() {
            match ObjectId::parse_str(logins_id) {
                Ok(object_id) => {
                    find_filter.insert("_id", doc! { "$lt": object_id });
                }
                Err(_err) => {}
            };
        }
        let mut cursor: Cursor<LoginsMongo> = auth_logins
            .find(find_filter)
            .limit(first)
            .sort(doc! { "$natural": -1 })
            .await?;
        let mut logins_edges: Vec<Option<LoginsEdge>> = Vec::<Option<LoginsEdge>>::new();
        while let Some(login_doc) = cursor.next().await {
            match login_doc {
                Ok(login_doc) => {
                    let mut cursor_string: String = "arrayconnection:".to_owned();
                    let hex: String = login_doc._id.to_hex();
                    cursor_string.push_str(&hex);
                    let mut node_id: String = "Login:".to_owned();
                    let hex: String = login_doc._id.to_hex();
                    node_id.push_str(&hex);
                    let cursor = general_purpose::STANDARD.encode(cursor_string);
                    end_cursor = Some(cursor.to_owned());
                    if start_cursor.is_none() {
                        start_cursor = Some(cursor.to_owned());
                    }
                    logins_edges.push(Some(LoginsEdge {
                        cursor: cursor.to_owned(),
                        node: Some(Login {
                            id: ID::from(general_purpose::STANDARD.encode(node_id)),
                            application_name: login_doc.application_name,
                            time: Date(login_doc.time),
                            address: login_doc.address,
                            user_id: login_doc.user_id,
                        }),
                    }));
                }
                Err(_login_doc) => {}
            }
        }
        let has_next_page: bool = cursor.advance().await?;
        Ok(LoginsConnection {
            page_info: PageInfo {
                has_next_page,
                has_previous_page: false,
                start_cursor,
                end_cursor,
            },
            edges: Some(logins_edges),
        })
    }
}

#[derive(SimpleObject)]
struct PageInfo {
    has_next_page: bool,
    has_previous_page: bool,
    start_cursor: Option<String>,
    end_cursor: Option<String>,
}

#[derive(SimpleObject)]
struct Login {
    id: ID,
    application_name: String,
    time: Date,
    address: String,
    user_id: String,
}

#[derive(SimpleObject)]
struct LoginsEdge {
    cursor: String,
    node: Option<Login>,
}

#[derive(SimpleObject)]
struct LoginsConnection {
    page_info: PageInfo,
    edges: Option<Vec<Option<LoginsEdge>>>,
}

#[derive(SimpleObject)]
struct Session {
    id: ID,
    application_name: String,
    #[graphql(name = "deviceOS")]
    device_os: String,
    device_browser: String,
    address: String,
    last_time_accessed: Date,
    user_id: String,
    expiration_date: Date,
}

#[derive(SimpleObject)]
struct SessionsEdge {
    cursor: String,
    node: Option<Session>,
}

#[derive(SimpleObject)]
struct SessionsConnection {
    page_info: PageInfo,
    edges: Option<Vec<Option<SessionsEdge>>>,
}

struct Query;

#[Object]
impl Query {
    async fn auth_user(&self, ctx: &Context<'_>) -> GraphQLResult<Option<AuthUser>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Err(
                Error::new(ErrorKind::InvalidInput, "Unauthenticated").extend_with(|_, _e| {})
            );
        }
        let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter: Document = doc! { "id": request_context.id.to_owned() };
        let user: Option<AuthUserMongo> = auth_users.find_one(filter).await?;
        match user {
            Some(user) => {
                let mut data: String = "AuthUser:".to_owned();
                let hex: String = user.id;
                data.push_str(&hex);
                Ok(Some(AuthUser {
                    id: ID::from(general_purpose::STANDARD.encode(data)),
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
                    language: user.language,
                }))
            }
            None => {
                return Err(Error::new(ErrorKind::InvalidInput, "User do not exist")
                    .extend_with(|_, _e| {}));
            }
        }
    }
}

struct RequestContext {
    id: String,
    ip: String,
    user_agent: String,
    refresh_token: String,
}

async fn health_check_handler() -> axum::response::Response {
    let response = AxumResponse::builder()
        .status(StatusCode::OK)
        .body(Body::empty())
        .unwrap();
    return response;
}

async fn graphql_handler(
    TypedHeader(cookie): TypedHeader<headers::Cookie>,
    TypedHeader(user_agent): TypedHeader<headers::UserAgent>,
    headers: HeaderMap,
    schema: Extension<Schema<Query, Mutation, EmptySubscription>>,
    queries: Extension<serde_json::Value>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    request: GraphQLRequest,
) -> axum::response::Response {
    let authorization_header = headers.get("Authorization");
    let authorization = match authorization_header {
        Some(authorization_header) => authorization_header.to_str(),
        None => Ok(""),
    };
    let x_forwarded_for_header = headers.get("X-Forwarded-For");
    let x_forwarded_for = match x_forwarded_for_header {
        Some(x_forwarded_for) => x_forwarded_for.to_str(),
        None => Ok(""),
    };
    let refresh_token = cookie.get("refreshToken");
    let remote_addr = addr.to_string();
    let request_context: RequestContext = RequestContext {
        id: match authorization {
            Ok(authorization) => {
                let mut iter: str::Split<&str> = authorization.split(".");
                iter.next();
                match iter.next() {
                    Some(part) => {
                        match GeneralPurpose::new(&alphabet::URL_SAFE, general_purpose::NO_PAD)
                            .decode(part)
                        {
                            Ok(json_vec) => match str::from_utf8(&json_vec) {
                                Ok(json_str) => match serde_json::from_str::<Claims>(json_str) {
                                    Ok(json_serde) => json_serde.id,
                                    Err(_err) => String::from(""),
                                },
                                Err(_err) => String::from(""),
                            },
                            Err(_err) => String::from(""),
                        }
                    }
                    None => String::from(""),
                }
            }
            Err(_authorization) => String::from(""),
        },
        ip: match x_forwarded_for {
            Ok(x_forwarded_for) => x_forwarded_for.to_string(),
            Err(_x_forwarded_for) => remote_addr,
        },
        user_agent: user_agent.to_string(),
        refresh_token: match refresh_token {
            Some(refresh_token) => refresh_token.to_string(),
            None => String::from(""),
        },
    };
    let request = request.into_inner();
    let doc_id = request.extensions.get("doc_id");
    let doc_id_str = match doc_id {
        Some(doc_id) => doc_id.to_string().replace("\"", ""),
        None => String::from(""),
    };
    if doc_id_str == "" {
        let response = AxumResponse::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(Body::empty())
            .unwrap();

        return response;
    }
    for value in queries.as_array().unwrap() {
        let query_id = value[0].as_str().unwrap();
        if query_id == doc_id_str {
            let query = value[1].as_str().unwrap();
            let not_iterable = schema
                .execute(Request::new(query).data(request_context))
                .await;
            let data: serde_json::Value = not_iterable.data.into_json().unwrap();
            let errors: String = serde_json::to_string(&not_iterable.errors).unwrap();
            let mut response: String = "{\"data\":".to_owned();
            let data_str = data.to_string();
            response.push_str(&data_str);
            response.push_str(",\"errors\":");
            response.push_str(&errors);
            response.push_str("}");
            let vecs: Vec<Result<Event, Infallible>> = vec![
                Ok(Event::default().event("next").data(response)),
                Ok(Event::default().event("complete").data("")),
            ];
            let stream = stream::iter(vecs);
            return Sse::new(stream).into_response();
        }
    }

    let response = AxumResponse::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::empty())
        .unwrap();

    return response;
}

#[tokio::main]
async fn main() {
    rustls::crypto::ring::default_provider()
        .install_default()
        .expect("Failed to install rustls crypto provider");
    let uri: &str = "mongodb://mongo-fintech:27017";
    let mut client_options = ClientOptions::parse(uri).await.unwrap();
    let server_api: ServerApi = ServerApi::builder().version(ServerApiVersion::V1).build();
    client_options.server_api = Some(server_api);
    let client: Client = Client::with_options(client_options).unwrap();
    let db: Database = client.database("auth");
    let auth_users: Collection<AuthUserMongo> = db.collection::<AuthUserMongo>("users");
    let auth_sessions: Collection<SessionsMongo> = db.collection::<SessionsMongo>("sessions");
    let auth_logins: Collection<LoginsMongo> = db.collection::<LoginsMongo>("logins");
    let redis_client: RedisClient = RedisClient::open("redis://redis-fintech/").unwrap();
    let redis_connection: RedisConnection = redis_client.get_connection().unwrap();
    let certs_dir = PathBuf::from_iter([env!("CARGO_MANIFEST_DIR"), "..", "..", "certs"]);
    let ca_file = certs_dir.join("minica.pem");
    let server_root_ca_cert = fs::read_to_string(ca_file).unwrap();
    let server_root_ca_cert = Certificate::from_pem(server_root_ca_cert);
    let cert_file = certs_dir.join("cert.pem");
    let cert_file_axum = cert_file.to_owned();
    let key_file = certs_dir.join("key.pem");
    let key_file_axum = key_file.to_owned();
    let client_cert = fs::read_to_string(cert_file).unwrap();
    let client_key = fs::read_to_string(key_file).unwrap();
    let client_identity = Identity::from_pem(client_cert, client_key);

    let tls = ClientTlsConfig::new()
        .domain_name("localhost")
        .ca_certificate(server_root_ca_cert)
        .identity(client_identity);

    let channel = Channel::from_static("https://grpc-fintech-node:443")
        .tls_config(tls)
        .unwrap()
        .connect()
        .await
        .unwrap();
    let grpc_client: AccountClient<Channel> = AccountClient::new(channel);
    let queries_dir =
        PathBuf::from_iter([env!("CARGO_MANIFEST_DIR"), "..", "backend-auth-node", "src"]);
    let queries_string: String = fs::read_to_string(queries_dir.join("queryMapAuth.json")).unwrap();
    let queries: serde_json::Value =
        serde_json::from_str(queries_string.as_str()).expect("Could not parse");

    let config: RustlsConfig = RustlsConfig::from_pem_file(cert_file_axum, key_file_axum)
        .await
        .unwrap();

    let cors = CorsLayer::new()
        .allow_methods(vec![Method::POST, Method::GET, Method::OPTIONS])
        .allow_origin("http://localhost:8000".parse::<HeaderValue>().unwrap())
        .allow_headers([AUTHORIZATION, CONTENT_TYPE])
        .allow_credentials(true);

    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(auth_users)
        .data(auth_sessions)
        .data(auth_logins)
        .data(Arc::new(Mutex::new(grpc_client)))
        .data(Arc::new(Mutex::new(redis_connection)))
        .finish();

    let app = Router::new()
        .route("/", get(health_check_handler))
        .route("/graphql", post(graphql_handler))
        .layer(cors)
        .layer(Extension(schema))
        .layer(Extension(queries));

    let addr = SocketAddr::from(([0, 0, 0, 0], 443));
    axum_server::bind_rustls(addr, config)
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}
