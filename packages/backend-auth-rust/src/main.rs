use std::{
    fs, convert::Infallible, sync::Arc, str::{self, FromStr}, net::SocketAddr, path::PathBuf,
    time::{SystemTime, UNIX_EPOCH}
};
use async_graphql::{
    EmptySubscription, Schema, Object, ID, Enum, Result as GraphQLResult, Context,
    SimpleObject, Scalar, ScalarType, InputValueResult, Value, InputValueError,
    futures_util::StreamExt, InputObject, Request
};
use async_graphql_axum::GraphQLRequest;
use axum::{
    body::Body, extract::ConnectInfo,
    http::{HeaderValue, Method, Response as AxumResponse, StatusCode, HeaderMap},
    response::{sse::{Event, Sse}, IntoResponse}, routing::post, Extension, Router
};
use mongodb::{
    Client, Collection, Cursor, Database,
    options::{ClientOptions, ServerApi, ServerApiVersion, ReturnDocument},
    bson::{doc, oid::ObjectId, DateTime, Document}
};
use serde::{Deserialize, Serialize};
use base64::{engine::{general_purpose, GeneralPurpose}, Engine as _, alphabet};
use bcrypt::{verify, hash, DEFAULT_COST};
use jsonwebtoken::{encode, Header, EncodingKey, decode, DecodingKey, Validation, TokenData};
use woothee::parser::{Parser, WootheeResult};
use cookie::{Cookie, time::OffsetDateTime};
use redis::{Commands, Client as RedisClient, Connection as RedisConnection, RedisResult};
use tokio::sync::{Mutex, MutexGuard};
use tonic::transport::Channel;
use auth::{CreateUserInput, account_client::AccountClient};
use tower_http::cors::CorsLayer;
use axum_server::tls_rustls::RustlsConfig;
use uuid::Uuid;
use axum_extra::{headers, TypedHeader};
use futures::stream;

pub mod auth {
    tonic::include_proto!("auth_package");
}

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
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> GraphQLResult<Option<SignInPayload>> {
        let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
        let filter: Document = doc! { "email": input.email };
        let user: Option<AuthUserMongo> = auth_users.find_one(filter).await?;
        Ok(match user {
            Some(user) => {
                let valid: bool = verify(input.password, &user.password)?;
                match valid {
                    true => {
                        let mut con: tokio::sync::MutexGuard<RedisConnection> = ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                        let id: String = user.id;
                        let black_listed_user: RedisResult<String> = con.get(id.to_owned());
                        match black_listed_user {
                            Ok(_black_listed_user) => Some(SignInPayload {
                                error: String::from("El usuario estará bloqueado."),
                                client_mutation_id: None,
                            }),
                            Err(_err) => {
                                let start: SystemTime = SystemTime::now();
                                let since_the_epoch: i64 = start
                                    .duration_since(UNIX_EPOCH)
                                    .expect("Time went backwards")
                                    .as_secs() as i64;
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
                                let access_token: String = encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref()))?;
                                let refresh_token: String = encode(&Header::default(), &my_claims_refresh, &EncodingKey::from_secret(REFRESHSECRET.as_ref()))?;
                                ctx.append_http_header("accessToken", access_token);
                                match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh) {
                                    Ok(now) => {
                                        let cookie: String = Cookie::build(("refreshToken", refresh_token.to_owned()))
                                            .http_only(true)
                                            .expires(now)
                                            .secure(true)
                                            .same_site(cookie::SameSite::Strict)
                                            .domain("relay-graphql-monorepo.com")
                                            .to_string();
                                        ctx.append_http_header("Set-Cookie", cookie.to_string());
                                        let auth_logins: &Collection<LoginsMongo> = ctx.data::<Collection<LoginsMongo>>()?;
                                        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
                                        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
                                        let new_login: LoginsMongo = LoginsMongo {
                                            _id: ObjectId::new(),
                                            application_name: String::from("Lerna Monorepo"),
                                            address: request_context.ip.to_owned(),
                                            time: DateTime::now(),
                                            user_id: id.to_owned()
                                        };
                                        auth_logins.insert_one(new_login).await?;
                                        let parser: Parser = Parser::new();
                                        let result: Option<WootheeResult> = parser.parse(request_context.user_agent.as_str());
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
                                            },
                                            None => {}
                                        }
                                        auth_sessions.insert_one(
                                            SessionsMongo {
                                                _id: ObjectId::new(),
                                                refresh_token: refresh_token.to_owned(),
                                                last_time_accessed: DateTime::now(),
                                                application_name: String::from("Lerna Monorepo"),
                                                device_os,
                                                address: request_context.ip.to_owned(),
                                                user_id: id.to_owned(),
                                                device_browser,
                                                expiration_date: DateTime::from_millis(since_the_epoch_refresh * 1000)
                                            }
                                        ).await?;
                                        Some(SignInPayload {
                                            error: String::from(""),
                                            client_mutation_id: None,
                                        })
                                    },
                                    Err(_err) => Some(SignInPayload {
                                        error: String::from("Tiempo unix no valido."),
                                        client_mutation_id: None,
                                    })
                                }
                            }
                        }
                    },
                    false => Some(SignInPayload {
                        error: String::from("Incorrect password"),
                        client_mutation_id: None,
                    })
                }
            },
            None => {
                Some(SignInPayload {
                    error: String::from("User do not exists"),
                    client_mutation_id: None,
                })
            }
        })
    }
    async fn log_out(&self, ctx: &Context<'_>, _input: LogOutInput) -> GraphQLResult<Option<LogOutPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        let cookie: String = Cookie::build(("refreshToken", ""))
            .http_only(true)
            .expires(OffsetDateTime::now_utc())
            .secure(true)
            .same_site(cookie::SameSite::Strict)
            .domain("relay-graphql-monorepo.com")
            .to_string();
        ctx.append_http_header("Set-Cookie", cookie.to_string());
        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
        let start: SystemTime = SystemTime::now();
        let since_the_epoch: i64 = start
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs() as i64;
        let since_the_epoch_refresh: i64 = since_the_epoch - 900;
        let result: Option<SessionsMongo> = auth_sessions.find_one_and_update(
            doc! { "refresh_token": request_context.refresh_token.to_owned() },
            doc! {
                "$set": {
                    "expiration_date": DateTime::from_millis(since_the_epoch_refresh * 1000)
                }
            }
        ).await?;
        Ok(match result {
            Some(result) => {
                let mut con: MutexGuard<RedisConnection> = ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                con.set(result.refresh_token.as_str(), since_the_epoch)?;
                con.expire(result.refresh_token.as_str(), 15 * 60)?;
                Some(LogOutPayload {
                    error: String::from(""),
                    client_mutation_id: None,
                })
            },
            None => {
                Some(LogOutPayload {
                    error: String::from(""),
                    client_mutation_id: None,
                })
            }
        })
    }
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> GraphQLResult<Option<SignUpPayload>> {
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
                auth_users.insert_one(AuthUserMongo {
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
                }).await?;
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
                let access_token: String = encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref()))?;
                let refresh_token: String = encode(&Header::default(), &my_claims_refresh, &EncodingKey::from_secret(REFRESHSECRET.as_ref()))?;
                ctx.append_http_header("accessToken", access_token);
                match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh) {
                    Ok(now) => {
                        let cookie: String = Cookie::build(("refreshToken", refresh_token.to_owned()))
                            .http_only(true)
                            .expires(now)
                            .secure(true)
                            .same_site(cookie::SameSite::Strict)
                            .domain("relay-graphql-monorepo.com")
                            .to_string();
                        ctx.append_http_header("Set-Cookie", cookie.to_string());
                        let auth_logins: &Collection<LoginsMongo> = ctx.data::<Collection<LoginsMongo>>()?;
                        let auth_sessions: &Collection<SessionsMongo> = ctx.data::<Collection<SessionsMongo>>()?;
                        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
                        let new_login: LoginsMongo = LoginsMongo {
                            _id: ObjectId::new(),
                            application_name: String::from("Lerna Monorepo"),
                            address: request_context.ip.to_owned(),
                            time: DateTime::now(),
                            user_id: id.to_owned()
                        };
                        auth_logins.insert_one(new_login).await?;
                        let parser = Parser::new();
                        let result: Option<WootheeResult> = parser.parse(request_context.user_agent.as_str());
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
                            },
                            None => {}
                        }
                        auth_sessions.insert_one(
                            SessionsMongo {
                                _id: ObjectId::new(),
                                refresh_token: refresh_token.to_owned(),
                                last_time_accessed: DateTime::now(),
                                application_name: String::from("Lerna Monorepo"),
                                device_os,
                                address: request_context.ip.to_owned(),
                                user_id: id.to_owned(),
                                device_browser,
                                expiration_date: DateTime::from_millis(since_the_epoch_refresh * 1000)
                            }
                        ).await?;
                        let mut grpc_client = ctx.data::<Arc<Mutex<AccountClient<Channel>>>>()?.lock().await;
                        let request = tonic::Request::new(
                            CreateUserInput {
                                id: id.to_owned(),
                            }
                        );
                        grpc_client.create_user(request).await?;
                        Some(SignUpPayload {
                            error: String::from(""),
                            client_mutation_id: None,
                        })
                    },
                    Err(_err) => Some(SignUpPayload {
                        error: String::from("Tiempo unix no valido."),
                        client_mutation_id: None,
                    })
                }
            }
        })
    }
    async fn update_user(&self, ctx: &Context<'_>, input: UpdateUserInput) -> GraphQLResult<Option<UpdateUserPayload>> {
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
        let user: Option<AuthUserMongo> = auth_users.find_one_and_update(filter, doc! {
            "name": input.name,
            "apellido_materno": input.apellido_materno,
            "apellido_paterno": input.apellido_paterno,
            "RFC": input.rfc,
            "CURP": input.curp,
            "clabe": input.clabe,
            "mobile": input.mobile,
            "email": input.email,
            "language": input.language.to_string(),
        }).return_document(ReturnDocument::After).await?;
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
                    })
                })
            },
            None => Some(UpdateUserPayload {
                error: String::from("No user found."),
                client_mutation_id: None,
                auth_user: None,
            })
        })
    }
    async fn extend_session(&self, ctx: &Context<'_>, _input: ExtendSessionInput) -> GraphQLResult<Option<ExtendSessionPayload>> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() || request_context.refresh_token.is_empty() {
            return Ok(Some(ExtendSessionPayload {
                error: String::from("No valid access token."),
                client_mutation_id: None,
            }));
        }
        let token: TokenData<Claims> = match decode::<Claims>(request_context.refresh_token.as_str(), &DecodingKey::from_secret(REFRESHSECRET.as_ref()), &Validation::default()) {
            Ok(data) => data,
            Err(_err) => {
                return Ok(Some(ExtendSessionPayload {
                    error: String::from("User do not exists"),
                    client_mutation_id: None,
                }))
            }
        };
        let mut con: MutexGuard<RedisConnection> = ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
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
            },
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
        let access_token: String = encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref()))?;
        let refresh_token: String = encode(&Header::default(), &my_claims_refresh, &EncodingKey::from_secret(REFRESHSECRET.as_ref()))?;
        ctx.append_http_header("accessToken", access_token);
        let now: OffsetDateTime = match OffsetDateTime::from_unix_timestamp(since_the_epoch_refresh) {
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
            .same_site(cookie::SameSite::Strict)
            .domain("relay-graphql-monorepo.com")
            .to_string();
        ctx.append_http_header("Set-Cookie", cookie);
        Ok(Some(ExtendSessionPayload {
            error: String::from(""),
            client_mutation_id: None,
        }))
    }
    async fn revoke_session(&self, ctx: &Context<'_>, input: RevokeSessionInput) -> GraphQLResult<Option<RevokeSessionPayload>> {
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
                let mut con: MutexGuard<RedisConnection> = ctx.data::<Arc<Mutex<RedisConnection>>>()?.lock().await;
                con.set(request_context.refresh_token.as_str(), since_the_epoch)?;
                con.expire(request_context.refresh_token.as_str(), 15 * 60)?;
                match request_context.refresh_token == result.refresh_token {
                    true => {
                        /*
                        httpOnly: true,
                        expires: refreshTokenExpireDate,
                        secure: true,
                        sameSite: IS_PRODUCTION ? "strict" : "none",
                        domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
                        */
                        let cookie: String = Cookie::build(("refreshToken", ""))
                            .http_only(true)
                            .expires(OffsetDateTime::now_utc())
                            .secure(true)
                            .same_site(cookie::SameSite::Strict)
                            .domain("relay-graphql-monorepo.com")
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
                            })
                        })
                    },
                    false => {
                        Some(RevokeSessionPayload {
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
                        })
                    }   
                }
            },
            None => Some(RevokeSessionPayload {
                error: String::from("Mongo error."),
                client_mutation_id: None,
                should_reload_browser: false,
                session: None,
            })
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
    #[graphql(name="EN")]
    en,
    #[graphql(name="ES")]
    es,
    #[graphql(name="DEFAULT")]
    default,
}

impl Languages {
    fn to_string(&self) -> String {
        match self {
            Languages::default => String::from("default"),
            Languages::en => String::from("en"),
            Languages::es => String::from("es"),
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
    async fn sessions(&self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> GraphQLResult<SessionsConnection> {
        let request_context: &RequestContext = ctx.data::<RequestContext>()?;
        if request_context.id.is_empty() {
            return Ok(SessionsConnection {
                page_info: PageInfo {
                    has_next_page: false,
                    has_previous_page: false,
                    start_cursor: Some(String::from("")),
                    end_cursor: Some(String::from(""))
                },
                edges: Some(Vec::new()),
            })
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
                            None => String::from("")
                        }
                    },
                    Err(_json_str) => String::from("")
                },
                Err(_decoded_cursor) => String::from("")
            },
            None => String::from("")
        };
        let mut find_filter: Document = doc! { "userId": request_context.id.to_owned() };
        if !sessions_id.is_empty() {
            match ObjectId::parse_str(sessions_id) {
                Ok(object_id) => {
                    find_filter.insert("_id", doc! { "$lt": object_id });
                },
                Err(_err) => {}
            };   
        }
        let limit: i64 = match first {
            Some(first) => first,
            None => 0
        };
        let mut cursor: Cursor<SessionsMongo> = auth_sessions.find(find_filter).limit(limit + 1).sort(doc! { "$natural": -1 }).await?;
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
                    sessions_edges.push(Some(SessionsEdge {
                        cursor: general_purpose::STANDARD.encode(cursor_string),
                        node: Some(Session {
                            id: ID::from(general_purpose::STANDARD.encode(node_id)),
                            application_name: session_doc.application_name,
                            device_os: session_doc.device_os,
                            device_browser: session_doc.device_browser,
                            address: session_doc.address,
                            last_time_accessed: Date(session_doc.last_time_accessed),
                            user_id: session_doc.user_id,
                            expiration_date: Date(session_doc.expiration_date),
                        })
                    }));
                }
                Err(_session_doc) => {}
            }
        }
        let edge_index: usize = match usize::try_from(limit) {
            Ok(limit) => limit,
            Err(_err) => {
                return Ok(SessionsConnection {
                    page_info: PageInfo {
                        has_next_page: false,
                        has_previous_page: false,
                        start_cursor: Some(String::from("")),
                        end_cursor: Some(String::from(""))
                    },
                    edges: Some(Vec::new()),
                })
            }
        };
        let limit_edge: Option<&Option<SessionsEdge>> = sessions_edges.get(edge_index);
        let has_next_page: bool = match limit_edge {
            Some(limit_edge) => 
                match limit_edge {
                    Some(_limit_edge) => true,
                    None => false
                }
            ,
            None => false,
        };
        let first_element: Option<&Option<SessionsEdge>> = sessions_edges.get(0);
        let start_cursor: String = match first_element {
            Some(first_element) => match first_element {
                Some(first_element) => first_element.cursor.to_owned(),
                None => String::from("")
            },
            None => String::from(""),
        };
        let last_element: Option<&Option<SessionsEdge>> = sessions_edges.get(edge_index - 1);
        let end_cursor: String = match last_element {
            Some(last_element) => match last_element {
                Some(last_element) => last_element.cursor.to_owned(),
                None => String::from("")
            },
            None => String::from(""),
        };
        if has_next_page {
            sessions_edges.pop();
        }
        Ok(SessionsConnection {
            page_info: PageInfo {
                has_next_page,
                has_previous_page: false,
                start_cursor: Some(start_cursor),
                end_cursor: Some(end_cursor),
            },
            edges: Some(sessions_edges)
        })
    }
    async fn logins(&self,
        ctx: &Context<'_>,
        after: Option<String>,
        first: Option<i64>,
    ) -> GraphQLResult<LoginsConnection> {
            let request_context: &RequestContext = ctx.data::<RequestContext>()?;
            if request_context.id.is_empty() {
                return Ok(LoginsConnection {
                    page_info: PageInfo {
                        has_next_page: false,
                        has_previous_page: false,
                        start_cursor: Some(String::from("")),
                        end_cursor: Some(String::from(""))
                    },
                    edges: Some(Vec::new())
                })
            }
            let auth_logins: &Collection<LoginsMongo> = ctx.data::<Collection<LoginsMongo>>()?;
            let logins_id: String = match after {
                Some(after) => match general_purpose::STANDARD.decode(&after) {
                    Ok(decoded_cursor) => match str::from_utf8(&decoded_cursor) {
                        Ok(json_str) => {
                            let mut iter = json_str.split(":");
                            iter.next();
                            match iter.next() {
                                Some(part) => String::from(part),
                                None => String::from("")
                            }
                        },
                        Err(_json_str) => String::from("")
                    },
                    Err(_decoded_cursor) => String::from("")
                },
                None => String::from("")
            };
            let mut find_filter: Document = doc! { "userId": request_context.id.to_owned() };
            if !logins_id.is_empty() {
                match ObjectId::parse_str(logins_id) {
                    Ok(object_id) => {
                        find_filter.insert("_id", doc! { "$lt": object_id });
                    },
                    Err(_err) => {
                        return Ok(LoginsConnection {
                            page_info: PageInfo {
                                has_next_page: false,
                                has_previous_page: false,
                                start_cursor: Some(String::from("")),
                                end_cursor: Some(String::from(""))
                            },
                            edges: Some(Vec::new())
                        })
                    },
                };
                
            }
            let limit: i64 = match first {
                Some(first) => first,
                None => 0
            };
            let mut cursor: Cursor<LoginsMongo> = auth_logins.find(find_filter).limit(limit + 1).sort(doc! { "$natural": -1 }).await?;
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
                        logins_edges.push(Some(LoginsEdge {
                            cursor: general_purpose::STANDARD.encode(cursor_string),
                            node: Some(Login {
                                id: ID::from(general_purpose::STANDARD.encode(node_id)),
                                application_name: login_doc.application_name,
                                time: Date(login_doc.time),
                                address: login_doc.address,
                                user_id: login_doc.user_id,
                            })
                        }));
                    }
                    Err(_login_doc) => {}
                }
            }
            let edge_index: usize = match usize::try_from(limit) {
                Ok(limit) => limit,
                Err(_err) => {
                    return Ok(LoginsConnection {
                        page_info: PageInfo {
                            has_next_page: false,
                            has_previous_page: false,
                            start_cursor: Some(String::from("")),
                            end_cursor: Some(String::from(""))
                        },
                        edges: Some(Vec::new())
                    })
                }
            };
            let limit_edge: Option<&Option<LoginsEdge>> = logins_edges.get(edge_index);
            let has_next_page: bool = match limit_edge {
                Some(limit_edge) => match limit_edge {
                    Some(_limit_edge) => true,
                    None => false
                },
                None => false,
            };
            let first_element: Option<&Option<LoginsEdge>> = logins_edges.get(0);
            let start_cursor: String = match first_element {
                Some(first_element) => match first_element {
                    Some(first_element) => first_element.cursor.to_owned(),
                    None => String::from("")
                } ,
                None => String::from(""),
            };
            let last_element: Option<&Option<LoginsEdge>> = logins_edges.get(edge_index - 1);
            let end_cursor: String = match last_element {
                Some(last_element) => match last_element {
                    Some(last_element) => last_element.cursor.to_owned(),
                    None => String::from(""),
                },
                None => String::from(""),
            };
            if has_next_page {
                logins_edges.pop();
            }
            Ok(LoginsConnection {
                page_info: PageInfo {
                    has_next_page,
                    has_previous_page: false,
                    start_cursor: Some(start_cursor),
                    end_cursor: Some(end_cursor),
                },
                edges: Some(logins_edges)
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
    #[graphql(name = "type")]
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
  async fn auth_user(&self, ctx: &Context<'_>) -> GraphQLResult<AuthUser> {
    let request_context: &RequestContext = ctx.data::<RequestContext>()?;
    if request_context.id.is_empty() {
        let data: &str = "AuthUser:";
        let no_user: AuthUser = AuthUser {
            id: ID::from(general_purpose::STANDARD.encode(data)),
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
    let auth_users: &Collection<AuthUserMongo> = ctx.data::<Collection<AuthUserMongo>>()?;
    let filter: Document = doc! { "id": request_context.id.to_owned() };
    let user: Option<AuthUserMongo> = auth_users.find_one(filter).await?;
    match user {
        Some(user) => {
            let mut data: String = "AuthUser:".to_owned();
            let hex: String = user.id;
            data.push_str(&hex);
            Ok(
                AuthUser {
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
                    language: user.language
                }
            )

        }
        None => {
            let data: &str = "AuthUser:";
            let no_user: AuthUser = AuthUser {
                id: ID::from(general_purpose::STANDARD.encode(data)),
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
    user_agent: String,
    refresh_token: String,
}

async fn graphql_handler(
    TypedHeader(cookie): TypedHeader<headers::Cookie>,
    TypedHeader(user_agent): TypedHeader<headers::UserAgent>,
    headers: HeaderMap,
    schema: Extension<Schema<Query, Mutation, EmptySubscription>>,
    ConnectInfo(remote_addr): ConnectInfo<SocketAddr>,
    queries: Extension<Vec<Vec<String>>>,
    request: GraphQLRequest,
) -> axum::response::Response {
    let authorization = headers
        .get("Authorization").unwrap()
        .to_str();
    let x_forwarded_for = headers
        .get("X-Forwarded-For").unwrap()
        .to_str();
    let refresh_token = cookie.get("refreshToken");
    let remote_addr = remote_addr.to_string();
    let request_context: RequestContext = RequestContext {
        id: match authorization {
            Ok(authorization) => {
                let mut iter: str::Split<&str> = authorization.split(".");
                iter.next();
                match iter.next() {
                   Some(part) => match GeneralPurpose::new(&alphabet::URL_SAFE, general_purpose::NO_PAD).decode(part) {
                        Ok(json_vec) => match str::from_utf8(&json_vec) {
                            Ok(json_str) => match serde_json::from_str::<Claims>(json_str) {
                                Ok(json_serde) => json_serde.id,
                                Err(_err) => String::from("")
                            },
                            Err(_err) => String::from("")
                        },
                        Err(_err) => String::from("")
                    },
                   None => String::from("")
                }
            },
            Err(_authorization) => String::from("")
        },
        ip: match x_forwarded_for {
            Ok(x_forwarded_for) => x_forwarded_for.to_string(),
            Err(_x_forwarded_for) => remote_addr
        },
        user_agent: user_agent.to_string(),
        refresh_token: match refresh_token {
            Some(refresh_token) => refresh_token.to_string(),
            None => String::from("")
        },
    };
    let request = request.into_inner();
    let doc_id = request.extensions.get("doc_id").unwrap();
    let doc_id_str = doc_id.to_string().replace("\"", "");
    for value in queries {
        let query_id = value[0].clone();
        if query_id == doc_id_str {
            let query = value[1].clone();
            let not_iterable = schema.execute(Request::new(query).data(request_context)).await;
            let data: serde_json::Value = not_iterable.data.into_json().unwrap();
            let mut response = "data: ".to_owned();
            let data_str = data.to_string();
            response.push_str(&data_str);
            let vecs: Vec<Result<Event, Infallible>> = vec![
                Ok(Event::default().event("next").json_data(response).unwrap()),
                Ok(Event::default().event("complete").json_data("data:").unwrap()),
            ];
            let stream = stream::iter(vecs);
            return Sse::new(stream).into_response();
        }
    }

    let response = AxumResponse::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::empty()).unwrap();

    return response;
}

#[tokio::main]
async fn main() {
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
    let grpc_client: AccountClient<Channel> = AccountClient::connect("http://grpc-fintech-node:1983").await.unwrap();
    let queries_string = fs::read_to_string("./src/queryMap.json").unwrap();
    let queries: Vec<Vec<String>> = serde_json::from_str(queries_string.as_str()).expect("Could not parse");

    let config = RustlsConfig::from_pem_file(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("self_signed_certs")
            .join("cert.pem"),
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("self_signed_certs")
            .join("key.pem"),
    )
    .await
    .unwrap();

    let cors = CorsLayer::new()
        .allow_methods(vec![Method::POST])
        .allow_origin("http://localhost:8000".parse::<HeaderValue>().unwrap());

    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(auth_users)
        .data(auth_sessions)
        .data(auth_logins)
        .data(Arc::new(Mutex::new(grpc_client)))
        .data(Arc::new(Mutex::new(redis_connection)))
        .finish();
    
    let app = Router::new()
        .route("/graphql", post(graphql_handler))
        .layer(cors)
        .layer(Extension(schema))
        .layer(Extension(queries));
    
    let addr = SocketAddr::from(([127, 0, 0, 1], 443));
    axum_server::bind_rustls(addr, config)
        .serve(app.into_make_service())
        .await
        .unwrap();
}