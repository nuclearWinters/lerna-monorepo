# Monorepo with GraphQL Microservices and React Relay specifications

This project explores microservices in a monorepository. These microservices expose a GraphQL schema with React Relay specifications and support HTTP2 at application layer.

Frontend is a Single Page Application built with React and React Relay. It uses code splitting techniques to reduce the main bundle size and starts requesting data from the server sooner thanks to a render-as-you-fetch pattern. It uses Suspense features to handle the loading states. Also, it uses an Atomic CSS Framework to generate a small CSS file.

To handle GraphQL Subscriptions the application is using Server-Sent Events (to support realtime features). It uses Docker to run the microservices and databases (MongoDB and Redis) locally. Implementing an Event Driven Architecture with Kafka (workers are not indempotent yet).

For Authentication and Authorization we are using JSON Web Tokens with a Refresh Token implementation. Microservices uses gRPC to communicate and verify tokens.

Finally we are testing the project with Jest: We test Kafka events by using the _testcontainers_ library, we test MongoDB by using the _@shelf/jest-mongodb_ library and GraphQL microservices by using the _supertest_ library.

(I'm experimenting with Rust and Cassandra in other folders.)

Demo: [https://relay-graphql-monorepo.com](https://relay-graphql-monorepo.com)

**Programming Languages:**

- Javascript
- Typescript

**Architecture Tools:**

- Kafka
- gRPC
- GraphQL (Relay specifications)

**Developer Tools:**

- Prettier
- Webpack
- Eslint
- Jest
- Babel
- Docker
- PNPM

**NPM Dependency Highlights:**

- lerna
- graphql
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

**Databases:**

- MongoDB
- Redis

To set up the project locally:

1. Install Docker and NodeJS 20

2. Run `pnpm install` at root folder (this will help your IDE to apply linting)

3. Run `make setup` at root folder (this will create a volume in Docker in which the dependencies will be stored)

4. Run `make install` at root folder (this will install dependencies by using an Alpine Linux OS)

5. Install [minica](https://github.com/jsha/minica) and run `minica --domains localhost`. Then copy `minica.pem`, `cert.pem` and `key.pem` from `minica` to `certs` project folder (this will create a self-signed certificate so node microservices can use HTTP2).

6. Go to `packages` folder, then `backend-auth-rust` folder and build the docker image with `docker build -t rust-graphql .` command

7. Run `make up` at root folder (this will run the instances with Docker Compose)

8. Run `pnpm populate` at root folder from another terminal window (this will populate the mongo database with data)

9. Go to `http://localhost:8000` to see the application
