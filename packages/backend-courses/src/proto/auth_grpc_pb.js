// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');

function serialize_authPackage_CreateUserInput(arg) {
  if (!(arg instanceof auth_pb.CreateUserInput)) {
    throw new Error('Expected argument of type authPackage.CreateUserInput');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_CreateUserInput(buffer_arg) {
  return auth_pb.CreateUserInput.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_authPackage_CreateUserPayload(arg) {
  if (!(arg instanceof auth_pb.CreateUserPayload)) {
    throw new Error('Expected argument of type authPackage.CreateUserPayload');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_CreateUserPayload(buffer_arg) {
  return auth_pb.CreateUserPayload.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_authPackage_RenewAccessTokenInput(arg) {
  if (!(arg instanceof auth_pb.RenewAccessTokenInput)) {
    throw new Error('Expected argument of type authPackage.RenewAccessTokenInput');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_RenewAccessTokenInput(buffer_arg) {
  return auth_pb.RenewAccessTokenInput.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_authPackage_RenewAccessTokenPayload(arg) {
  if (!(arg instanceof auth_pb.RenewAccessTokenPayload)) {
    throw new Error('Expected argument of type authPackage.RenewAccessTokenPayload');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_authPackage_RenewAccessTokenPayload(buffer_arg) {
  return auth_pb.RenewAccessTokenPayload.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthService = exports.AuthService = {
  renewAccessToken: {
    path: '/authPackage.Auth/renewAccessToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.RenewAccessTokenInput,
    responseType: auth_pb.RenewAccessTokenPayload,
    requestSerialize: serialize_authPackage_RenewAccessTokenInput,
    requestDeserialize: deserialize_authPackage_RenewAccessTokenInput,
    responseSerialize: serialize_authPackage_RenewAccessTokenPayload,
    responseDeserialize: deserialize_authPackage_RenewAccessTokenPayload,
  },
  createUser: {
    path: '/authPackage.Auth/createUser',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.CreateUserInput,
    responseType: auth_pb.CreateUserPayload,
    requestSerialize: serialize_authPackage_CreateUserInput,
    requestDeserialize: deserialize_authPackage_CreateUserInput,
    responseSerialize: serialize_authPackage_CreateUserPayload,
    responseDeserialize: deserialize_authPackage_CreateUserPayload,
  },
};

exports.AuthClient = grpc.makeGenericClientConstructor(AuthService);
