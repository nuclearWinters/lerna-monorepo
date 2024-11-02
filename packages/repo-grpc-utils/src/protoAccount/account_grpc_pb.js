// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var account_pb = require('./account_pb.js');

function serialize_accountPackage_CreateUserInput(arg) {
  if (!(arg instanceof account_pb.CreateUserInput)) {
    throw new Error('Expected argument of type accountPackage.CreateUserInput');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_accountPackage_CreateUserInput(buffer_arg) {
  return account_pb.CreateUserInput.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_accountPackage_CreateUserPayload(arg) {
  if (!(arg instanceof account_pb.CreateUserPayload)) {
    throw new Error('Expected argument of type accountPackage.CreateUserPayload');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_accountPackage_CreateUserPayload(buffer_arg) {
  return account_pb.CreateUserPayload.deserializeBinary(new Uint8Array(buffer_arg));
}


var AccountService = exports.AccountService = {
  createUser: {
    path: '/accountPackage.Account/createUser',
    requestStream: false,
    responseStream: false,
    requestType: account_pb.CreateUserInput,
    responseType: account_pb.CreateUserPayload,
    requestSerialize: serialize_accountPackage_CreateUserInput,
    requestDeserialize: deserialize_accountPackage_CreateUserInput,
    responseSerialize: serialize_accountPackage_CreateUserPayload,
    responseDeserialize: deserialize_accountPackage_CreateUserPayload,
  },
};

exports.AccountClient = grpc.makeGenericClientConstructor(AccountService);
