# Lerna GraphQL Relay API Gateway Typescript Monorepo

This project explore microservices with a monorepo approach.

These microservices use GraphQL with Relay specifications and can be requested by using the Gateway

Docker-compose will build up all microservices and manage images.

A test app that allows users to lend money to other users and receive interests in the future.

**Languages:**

- Javascript
- Typescript

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

**Communication Protocols:**

- RabbitMQ
- GRPC
- GraphQL

**Dependencies:**

- lerna
- express
- graphql
- graphql-ws
- jsonwebtokens
- @grpc/grpc-js
- amqplib
- cron
- mongodb
- react
- supertest

**Databases:**

- MongoDB
- Redis

**Environment:**

- Docker

To set up the project in dev mode:

1. Run `make setup`

2. Run `make up`

3. Run `npm run populate` on backend-auth and backend-fintech root folder projects
