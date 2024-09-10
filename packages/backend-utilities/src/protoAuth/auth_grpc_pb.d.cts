// package: authPackage
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb.cjs";

interface IAuthService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    jwtMiddleware: IAuthService_IjwtMiddleware;
}

interface IAuthService_IjwtMiddleware extends grpc.MethodDefinition<auth_pb.JWTMiddlewareInput, auth_pb.JWTMiddlewarePayload> {
    path: "/authPackage.Auth/jwtMiddleware";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.JWTMiddlewareInput>;
    requestDeserialize: grpc.deserialize<auth_pb.JWTMiddlewareInput>;
    responseSerialize: grpc.serialize<auth_pb.JWTMiddlewarePayload>;
    responseDeserialize: grpc.deserialize<auth_pb.JWTMiddlewarePayload>;
}

export const AuthService: IAuthService;

export interface IAuthServer extends grpc.UntypedServiceImplementation {
    jwtMiddleware: grpc.handleUnaryCall<auth_pb.JWTMiddlewareInput, auth_pb.JWTMiddlewarePayload>;
}

export interface IAuthClient {
    jwtMiddleware(request: auth_pb.JWTMiddlewareInput, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
    jwtMiddleware(request: auth_pb.JWTMiddlewareInput, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
    jwtMiddleware(request: auth_pb.JWTMiddlewareInput, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
}

export class AuthClient extends grpc.Client implements IAuthClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public jwtMiddleware(request: auth_pb.JWTMiddlewareInput, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
    public jwtMiddleware(request: auth_pb.JWTMiddlewareInput, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
    public jwtMiddleware(request: auth_pb.JWTMiddlewareInput, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.JWTMiddlewarePayload) => void): grpc.ClientUnaryCall;
}
