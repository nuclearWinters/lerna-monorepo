# Relay GraphQL Gateway Monorepo

This project explores microservices as a monorepository.

These microservices expose GraphQL schemas with Relay specifications and are merged into one in the GraphQL Gateway so the React app onyl need to fetch data from one endpoint.

Docker will run all microservices locally.

This app is about lending money and earning interest.

**Programming Languages:**

- Javascript
- Typescript

**Communications:**

- Kafka
- gRPC
- GraphQL

**Specifications:**

- Relay

**Tools:**

- Husky
- Prettier
- Webpack
- lint-staged
- Eslint
- Jest
- Babel
- Typescript

**Dependencies:**

- lerna
- express
- graphql
- graphql-ws
- jsonwebtokens
- @grpc/grpc-js
- kafkajs
- node-cron
- mongodb
- react
- supertest

**Databases:**

- MongoDB
- Redis

**Environment:**

- Docker

To set up the project locally:

1. Run `make up` in root folder

2. Run `npm run populate` on backend-auth and backend-fintech root folders

There is also a microservice refatored in Rust and another that uses Cassandra as the database (not finished)
