use std::convert::Infallible;

use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema, Object, ID, Enum, connection::{ Connection, Edge, EmptyFields, query }, Result, Context};
use async_graphql_warp::{GraphQLBadRequest, GraphQLResponse};
use http::StatusCode;
use warp::{http::Response as HttpResponse, Filter, Rejection};
use mongodb::{Client, options::{ClientOptions, ServerApi, ServerApiVersion, FindOneOptions}, bson::{doc, oid::ObjectId}, Collection};
use serde::{Deserialize, Serialize};
use base64::{engine::general_purpose, Engine as _};
use bcrypt::{verify};
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use std::time::{SystemTime, UNIX_EPOCH};
use cookie::{Cookie, time::OffsetDateTime};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    id: String,
    isBorrower: bool,
    isLender: bool,
    isSupport: bool,
    refreshTokenExpireTime: i64,
    exp: i64,
}

const ACCESSSECRET: &str = "ACCESSSECRET";
const REFRESHSECRET: &str = "REFRESHSECRET";

struct MutationLogin {
    error: String
}


#[Object]
impl MutationLogin {
    async fn error(&self) -> &String {
        &self.error
    }
}

struct Mutation;

#[Object]
impl Mutation {
    async fn login(&self, ctx: &Context<'_>, email: String, password: String) -> Result<MutationLogin> {
        let auth_users = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter = doc! { "email": email };
        let find_options = FindOneOptions::builder().build();
        let user = auth_users.find_one(filter, find_options).await?;
        match user {
            Some(user) => {
                let valid: bool = verify(password, &user.password)?;
                if !valid {
                    return Ok(MutationLogin {
                        error: String::from("La contraseña no coincide."),
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
                    isBorrower: user.isBorrower,
                    isLender: user.isLender,
                    isSupport: user.isSupport,
                    refreshTokenExpireTime: since_the_epoch_refresh,
                    exp: since_the_epoch_refresh,
                };
                let my_claims_access: Claims = Claims {
                    id: user.id.to_owned(),
                    isBorrower: user.isBorrower,
                    isLender: user.isLender,
                    isSupport: user.isSupport,
                    refreshTokenExpireTime: since_the_epoch_refresh,
                    exp: since_the_epoch_access,
                };
                let access_token: String = encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref()))?;
                let refresh_token: String = encode(&Header::default(), &my_claims_refresh, &EncodingKey::from_secret(REFRESHSECRET.as_ref()))?;
                ctx.append_http_header("accessToken", access_token);
                let now: OffsetDateTime = OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh).unwrap();
                let cookie: Cookie = Cookie::build("refreshToken", refresh_token).http_only(true).expires(now).finish();
                ctx.append_http_header("Set-Cookie", cookie.to_string());
                return Ok(MutationLogin {
                    error: String::from("")
                });
            },
            None => {
                return Ok(MutationLogin {
                    error: String::from("El usuario no existe."),
                });
            }
        };
        
      /*
      const blacklistedUser = await rdb?.get(user._id.toHexString());
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado.");
      }
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: user.id,
      });
      await sessions.updateOne(
        { sessionId },
        {
          $set: {
            lasTimeAccessed: now,
          },
          $setOnInsert: {
            applicationName: "Lerna Monorepo",
            type: deviceType,
            deviceName: deviceName,
            sessionId,
            address: ip,
            userId: user.id,
          },
        },
        { upsert: true }
      );*/
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthUserMongo {
    _id: ObjectId,
    id: String,
    name: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    RFC: String,
    CURP: String,
    clabe: String,
    mobile: String,
    email: String,
    isSupport: bool,
    isLender: bool,
    isBorrower: bool,
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
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<usize, i32, EmptyFields, EmptyFields>> {
        query(after, before, first, last, |after, before, first, last| async move {
            let mut start = after.map(|after| after + 1).unwrap_or(0);
            let mut end = before.unwrap_or(10);
            if let Some(first) = first {
                end = (start + first).min(end);
            }
            if let Some(last) = last {
                start = if last > end - start {
                     end
                } else {
                    end - last
                };
            }
            let mut connection = Connection::new(start > 0, end < 10);
            connection.edges.extend(
                (start..end).into_iter().map(|n|
                    Edge::with_additional_fields(n+10, n as i32, EmptyFields)
            ));
            Ok::<_, async_graphql::Error>(connection)
        }).await
    }
    async fn logins(&self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<usize, i32, EmptyFields, EmptyFields>> {
        query(after, before, first, last, |after, before, first, last| async move {
            let mut start = after.map(|after| after + 1).unwrap_or(0);
            let mut end = before.unwrap_or(10);
            if let Some(first) = first {
                end = (start + first).min(end);
            }
            if let Some(last) = last {
                start = if last > end - start {
                     end
                } else {
                    end - last
                };
            }
            let mut connection = Connection::new(start > 0, end < 10);
            connection.edges.extend(
                (start..end).into_iter().map(|n|
                    Edge::with_additional_fields(n+10, n as i32, EmptyFields)
            ));
            Ok::<_, async_graphql::Error>(connection)
        }).await
    }
}


struct Query;

#[Object]
impl Query {
  async fn auth_user(&self, ctx: &Context<'_>) -> Result<AuthUser> {
    let auth_users = ctx.data::<Collection<AuthUserMongo>>()?;
    let filter = doc! { };
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
                    apellido_paterno: user.apellidoPaterno,
                    apellido_materno: user.apellidoMaterno,
                    rfc: user.RFC,
                    curp: user.CURP,
                    clabe: user.clabe,
                    mobile: user.mobile,
                    email: user.email,
                    is_support: user.isSupport,
                    is_lender: user.isLender,
                    is_borrower: user.isBorrower,
                    language: user.language
                }
            )

        }
        None => {
            let data = "AuthUser:000000000000000000000000";
            Ok(AuthUser {
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
            })
        }
    }

    
  }
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
    let auth_users = db.collection::<AuthUserMongo>("users");
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(auth_users)
        .finish();

    println!("GraphiQL IDE: http://localhost:8001");

    let graphql_post = async_graphql_warp::graphql(schema).and_then(
        |(schema, request): (
            Schema<Query, Mutation, EmptySubscription>,
            async_graphql::Request,
        )| async move {
            Ok::<_, Infallible>(GraphQLResponse::from(schema.execute(request).await))
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