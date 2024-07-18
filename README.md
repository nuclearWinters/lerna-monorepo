# Monorepo with GraphQL Microservices and React Relay specifications

This project explores microservices in a monorepository. These microservices expose a GraphQL schema with Relay specifications and support HTTP2 at application layer.

The Frontend is a Single Page Application built with React and Relay. It uses code splitting techniques to reduce the main bundle size and start requesting data from the server sooner with a render-as-you-fetch pattern. It uses Suspense features to handle the loading states and also uses an Atomic CSS Framework to generate a small CSS file.

To handle GraphQL Subscriptions the application is using Server-Sent Events (to support realtime features). It uses Docker to run the microservices and databases (MongoDB and Redis) locally. The project uses an Event Driven Architecture thanks to Kafka.

Authentication and Authorization is done with JWT tokens. The Auth microservice uses gRPC to communicate with other microservices and it uses refresh tokens to handle sessions.

Finally we are testing the project with Jest: We test Kafka events by using testcontainers library, we test MongoDB by using @shelf/jest-mongodb and GraphQL microservices by using Supertest.

**Programming Languages:**

- Javascript
- Typescript

**Architecture Tools:**

- Kafka
- gRPC
- GraphQL (Relay specifications)

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
- react-relay
- stylexjs/stylex
- supertest
- testcontainers
- lint-staged

**Databases:**

- MongoDB
- Redis

To set up the project locally:

1. Run `npm install` in root folder

2. Install `mkcert` and run `mkcert -cert-file localhost.crt -key-file localhost.key localhost` in `cert` folder

3. Run `make up` in root folder

4. Run `npm run populate` in `backend-auth-node` and `backend-fintech-mongo` root folders

5. Go to `http://localhost:8000` to see the application

I'm experimenting with Rust and Cassandra in other folders.
