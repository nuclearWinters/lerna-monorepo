#!/bin/bash

PROTO_DIR=./src/proto

npx grpc_tools_node_protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:${PROTO_DIR} \
--js_out=import_style=commonjs,binary:${PROTO_DIR} \
--grpc_out=grpc_js:${PROTO_DIR} \
-I ./src/proto \
./src/proto/*.proto