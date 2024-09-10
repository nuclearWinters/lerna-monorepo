// GENERATED CODE -- DO NOT EDIT!

"use strict";
var grpc = require("@grpc/grpc-js");
var account_pb = require("./account_pb.cjs");

function serialize_authPackage_CreateUserInput(arg) {
  if (!(arg instanceof account_pb.CreateUserInput)) {
    throw new Error("Expected argument of type authPackage.CreateUserInput");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_CreateUserInput(buffer_arg) {
  return account_pb.CreateUserInput.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

function serialize_authPackage_CreateUserPayload(arg) {
  if (!(arg instanceof account_pb.CreateUserPayload)) {
    throw new Error("Expected argument of type authPackage.CreateUserPayload");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_CreateUserPayload(buffer_arg) {
  return account_pb.CreateUserPayload.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

var AccountService = (exports.AccountService = {
  createUser: {
    path: "/authPackage.Account/createUser",
    requestStream: false,
    responseStream: false,
    requestType: account_pb.CreateUserInput,
    responseType: account_pb.CreateUserPayload,
    requestSerialize: serialize_authPackage_CreateUserInput,
    requestDeserialize: deserialize_authPackage_CreateUserInput,
    responseSerialize: serialize_authPackage_CreateUserPayload,
    responseDeserialize: deserialize_authPackage_CreateUserPayload,
  },
});

exports.AccountClient = grpc.makeGenericClientConstructor(AccountService);
