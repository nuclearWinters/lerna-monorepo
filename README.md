# Monorepo with GraphQL Microservices and React Relay specifications

This project explores microservices in a monorepository. These microservices expose a GraphQL schema with React Relay specifications and support HTTP2 at application layer.

Frontend is a Single Page Application built with React and React Relay. It uses code splitting techniques to reduce the main bundle size and starts requesting data from the server sooner thanks to a render-as-you-fetch pattern. It uses Suspense features to handle the loading states. Also, it uses an Atomic CSS Framework to generate a small CSS file.

To handle GraphQL Subscriptions the application is using Server-Sent Events (to support realtime features). It uses Docker to run the microservices and databases (MongoDB and Redis) locally. Implementing an Event Driven Architecture with Kafka (workers are not indempotent yet).

For Authentication and Authorization we are using JSON Web Tokens with a Refresh Token implementation. Microservices uses gRPC to communicate and verify tokens.

Finally we are testing the project with Jest: We test Kafka events by using the _testcontainers_ library, we test MongoDB by using the _@shelf/jest-mongodb_ library and GraphQL microservices by using the _supertest_ library.

(I'm experimenting with Rust and Cassandra in other folders.)


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

1. Install Docker and NodeJS 20

2. Run `npm install --no-save` in root folder (this will help your IDE to apply linting)

3. Run `make setup` in root folder (this will create a volume in Docker in which the dependencies will be stored)

4. Run `make install` in root folder (this will install dependencies by using an Alpine Linux OS)

5. Install `mkcert` and run `mkcert -cert-file localhost.crt -key-file localhost.key localhost` in `cert` folder (this will create a self-signed certificate so node microservices can use HTTP2)

6. Run `make up` in root folder (this will run the instances with Docker Compose)

7. Run `npm run populate` in `backend-auth-node` and `backend-fintech-mongo` root folders (this will populate the mongo database with data)

8. Go to `http://localhost:8000` to see the application
