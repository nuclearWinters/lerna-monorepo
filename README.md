# Monorepo with a GraphQL Gateway and Relay specifications

This project explores microservices in a monorepository.

These microservices use GraphQL (with Relay specifications) along with a GraphQL Gateway. Docker is being used to orchestrate the rollout of services.

Microservices support HTTP2 at application layer.

**Programming Languages:**

- Javascript
- Typescript

**Architecture Tools:**

- Kafka
- gRPC
- GraphQL (Relay specifications)
- Nginx

**Developer Tools:**

- Husky
- Prettier
- Webpack
- Eslint
- Jest
- Babel
- Docker

**NPM Dependency Highlights:**

- lerna
- graphql
- graphql-sse
- jsonwebtokens
- @grpc/grpc-js
- kafkajs
- node-cron
- mongodb
- react
- supertest
- testcontainers
- lint-staged

**Databases:**

- MongoDB
- Redis
- Cassandra

To set up the project locally:

1. Run `make up` in root folder

2. Run `npm run populate` on backend-auth and backend-fintech root folders

There is also a microservice refatored in Rust and another that uses Cassandra as the database (not finished)
