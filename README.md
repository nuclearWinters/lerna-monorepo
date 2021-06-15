# Lerna GraphQL Relay Typescript Monorepo

This project explore GraphQL Javascript microservices with a monorepo approach.

docker-compose will build up all microservices and manage images.

All queries, mutations and subscriptions can be requested to the GraphQL Gateway API, which support Relay specifications.

The React app is build from scratch (no create-react-app) and uses Relay to manage state and GraphQL requests.

Languages:

- Javascript
- Typescript

Specifications:

- Relay

Tools:

- Husky
- Prettier
- Webpack
- lint-staged
- Eslint
- Jest
- Babel

Communication Protocols:

- RabbitMQ
- GRPC
- GraphQL

Dependencies:

- lerna
- express
- graphql
- graphql-tools
- graphql-subscriptions
- graphql-ws
- ws
- jsonwebtokens
- @grpc/grpc-js
- amqplib
- cron
- mongodb
- react-router-dom
- react
- react-i18next
- supertest
- ts-node-dev
- @shelf/jest-mongodb

Databases:

- MongoDB
- Redis

Environment:

- Docker
- Nginx

To set up the project in dev mode:

1. Run `make setup`

2. Run `make install`

3. Run `make bootstrap`

4. Run `make up`
