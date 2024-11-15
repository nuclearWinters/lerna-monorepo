use std::{sync::Arc, str::{self}, net::SocketAddr};
use mongodb::{Client, bson::{doc, oid::ObjectId, DateTime}, Collection, Database};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, Header, EncodingKey, decode, DecodingKey, Validation};
use std::time::{SystemTime, UNIX_EPOCH};
use redis::{Commands, Client as RedisClient, Connection as RedisConnection, RedisResult};
use tokio::sync::Mutex;
use tonic::{transport::Server, Request, Response, Status, Code};
use auth::auth_server::{Auth, AuthServer};
use auth::{JwtMiddlewareInput, JwtMiddlewarePayload};
use futures::executor;

pub mod auth {
    tonic::include_proto!("auth_package");
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
pub struct AuthService {
    redis: Arc<Mutex<RedisConnection>>,
    mongo: Arc<Mutex<Database>>
}

impl Default for AuthService {
    fn default() -> Self {
        let uri: &str = "mongodb://mongo-fintech:27017";
    // Create a new client and connect to the server
        let client = executor::block_on(Client::with_uri_str(uri)).unwrap();
        let db: Database = client.database("auth");
        let redis_client: RedisClient = RedisClient::open("redis://redis-fintech/").unwrap();
        let redis_connection: RedisConnection = redis_client.get_connection().unwrap();
        AuthService {
            redis: Arc::new(Mutex::new(redis_connection)),
            mongo: Arc::new(Mutex::new(db)),
        }
    }
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
    device_name: String,
    address: String,
    #[serde(rename(serialize = "userId", deserialize = "userId"))]
    user_id: String,
    #[serde(rename(serialize = "deviceOS", deserialize = "deviceOS"))]
    device_os: String,
    #[serde(rename(serialize = "expirationDate", deserialize = "expirationDate"))]
    expiration_date: DateTime,
}

#[tonic::async_trait]
impl Auth for AuthService {
    async fn jwt_middleware(
        &self,
        request: Request<JwtMiddlewareInput>,
    ) -> Result<Response<JwtMiddlewarePayload>, Status> {

        let req: JwtMiddlewareInput = request.into_inner();

        match req.refresh_token.to_owned().is_empty() {
            true => {
                return Err(Status::new(Code::InvalidArgument, "refresh token is invalid"))
            },
            false => {
                match req.access_token.to_owned().is_empty() {
                    true => {
                        match decode::<Claims>(req.access_token.as_str(), &DecodingKey::from_secret(ACCESSSECRET.as_ref()), &Validation::default()) {
                            Ok(user_access) => {
                                let is_blacklisted: RedisResult<i64> = self.redis.lock().await.get(req.refresh_token.to_owned());
                                match is_blacklisted {
                                    Ok(is_blacklisted) => {
                                        if user_access.claims.exp < is_blacklisted {
                                            return Err(Status::new(Code::Internal, "El usuario esta bloqueado."))
                                        }
                                        let reply: JwtMiddlewarePayload = JwtMiddlewarePayload {
                                            valid_access_token: req.access_token.to_owned(),
                                            id: user_access.claims.id.to_owned(),
                                            is_lender: user_access.claims.is_lender,
                                            is_borrower: user_access.claims.is_borrower,
                                            is_support: user_access.claims.is_support
                                        };
                                        return Ok(Response::new(reply))
                                    },
                                    Err(_is_blacklisted) => {
                                        return Err(Status::new(Code::Internal, "redis error"))
                                    }
                                }
                            },
                            Err(_user_access) => {
                                return Err(Status::new(Code::InvalidArgument, "access token is invalid"))
                            }
                        }
                    },
                    false => {
                        match decode::<Claims>(req.refresh_token.as_str(), &DecodingKey::from_secret(REFRESHSECRET.as_ref()), &Validation::default()) {
                            Ok(user_access) => {
                                let is_blacklisted: RedisResult<i64> = self.redis.lock().await.get(req.refresh_token.to_owned());
                                match is_blacklisted {
                                    Ok(is_blacklisted) => {
                                        if user_access.claims.exp < is_blacklisted {
                                            return Err(Status::new(Code::Internal, "El usuario esta bloqueado."))
                                        }
                                        let start: SystemTime = SystemTime::now();
                                        let since_the_epoch: i64 = start
                                            .duration_since(UNIX_EPOCH)
                                            .expect("Time went backwards")
                                            .as_secs() as i64;
                                        let since_the_epoch_access: i64 = since_the_epoch + 180;
                                        let my_claims_access: Claims = Claims {
                                            id: user_access.claims.id.to_owned(),
                                            is_borrower: user_access.claims.is_borrower,
                                            is_lender: user_access.claims.is_lender,
                                            is_support: user_access.claims.is_support,
                                            refresh_token_expire_time: user_access.claims.refresh_token_expire_time,
                                            exp: since_the_epoch_access,
                                        };
                                        match encode(&Header::default(), &my_claims_access, &EncodingKey::from_secret(ACCESSSECRET.as_ref())) {
                                            Ok(access_token) => {
                                                let reply: JwtMiddlewarePayload = JwtMiddlewarePayload {
                                                    valid_access_token: access_token,
                                                    id: user_access.claims.id.to_owned(),
                                                    is_lender: user_access.claims.is_lender,
                                                    is_borrower: user_access.claims.is_borrower,
                                                    is_support: user_access.claims.is_support
                                                };
                                                let sessions: Collection<SessionsMongo> = self.mongo.lock().await.collection::<SessionsMongo>("sessions");
                                                let result = sessions.update_one(
                                                    doc! { "refresh_token": req.refresh_token },
                                                    doc! {
                                                        "$set": {
                                                            "last_time_accessed": DateTime::now()
                                                        },
                                                    }
                                                ).await;
                                                match result {
                                                    Ok(_result) => {
                                                        return Ok(Response::new(reply))
                                                    },
                                                    Err(_result) => {
                                                        return Err(Status::new(Code::Internal, "mongo error"))
                                                    }
                                                }
                                            }, 
                                            Err(_acces_token) => {
                                                return Err(Status::new(Code::Internal, "redis error"))
                                            }
                                        }
                                    },
                                    Err(_is_blacklisted) => {
                                        return Err(Status::new(Code::Internal, "redis error"))
                                    }
                                }
                            },
                            Err(_user_access) => {
                                return Err(Status::new(Code::InvalidArgument, "refresh token is invalid"))
                            }
                        } 
                    }
                }
            }
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr: SocketAddr = "[::1]:4003".parse()?;
    let auth_service: AuthService = AuthService::default();
    //Add TLS service
    Server::builder()
        .add_service(AuthServer::new(auth_service))
        .serve(addr).await?;
    Ok(())
}