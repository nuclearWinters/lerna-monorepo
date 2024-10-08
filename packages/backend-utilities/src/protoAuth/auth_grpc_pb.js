// GENERATED CODE -- DO NOT EDIT!

"use strict";
var grpc = require("@grpc/grpc-js");
var auth_pb = require("./auth_pb.cjs");

function serialize_authPackage_JWTMiddlewareInput(arg) {
  if (!(arg instanceof auth_pb.JWTMiddlewareInput)) {
    throw new Error("Expected argument of type authPackage.JWTMiddlewareInput");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_JWTMiddlewareInput(buffer_arg) {
  return auth_pb.JWTMiddlewareInput.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

function serialize_authPackage_JWTMiddlewarePayload(arg) {
  if (!(arg instanceof auth_pb.JWTMiddlewarePayload)) {
    throw new Error(
      "Expected argument of type authPackage.JWTMiddlewarePayload"
    );
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_JWTMiddlewarePayload(buffer_arg) {
  return auth_pb.JWTMiddlewarePayload.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

var AuthService = (exports.AuthService = {
  jwtMiddleware: {
    path: "/authPackage.Auth/jwtMiddleware",
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.JWTMiddlewareInput,
    responseType: auth_pb.JWTMiddlewarePayload,
    requestSerialize: serialize_authPackage_JWTMiddlewareInput,
    requestDeserialize: deserialize_authPackage_JWTMiddlewareInput,
    responseSerialize: serialize_authPackage_JWTMiddlewarePayload,
    responseDeserialize: deserialize_authPackage_JWTMiddlewarePayload,
  },
});

exports.AuthClient = grpc.makeGenericClientConstructor(AuthService);
