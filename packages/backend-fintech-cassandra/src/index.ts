import { app, schema } from "./app";
import { jwt } from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import cassandra from "cassandra-driver";
import { UserCassandra } from "./types";
import { Kafka } from "kafkajs";
import { runKafkaConsumer } from "./kafka";
import { KAFKA, KAFKA_ID } from "@repo/utils/config";

const client = new cassandra.Client({
  contactPoints: ["cassandra-fintech"],
  localDataCenter: "datacenter1",
  keyspace: "fintech",
});

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
});

const producer = kafka.producer();

const Mapper = cassandra.mapping.Mapper;

const mapper = new Mapper(client, {
  models: {
    users: { tables: ["users"] },
    loans: { tables: ["loans"] },
    investments: { tables: ["investments"] },
    transactions: { tables: ["transactions"] },
  },
});

producer.connect().then(async () => {
  const users = mapper.forModel<UserCassandra>("users");
  const loans = mapper.forModel<UserCassandra>("loans");
  const investments = mapper.forModel<UserCassandra>("investments");
  const transactions = mapper.forModel<UserCassandra>("transactions");

  app.locals.client = client;
  app.locals.users = users;
  app.locals.loans = loans;
  app.locals.investments = investments;
  app.locals.transactions = transactions;
  app.locals.producer = producer;

  const consumer = kafka.consumer({ groupId: "test-group" });

  runKafkaConsumer(consumer, client, producer);

  const serverExpress = app.listen(4004, () => {
    const wsServer = new WebSocketServer({
      server: serverExpress,
      path: "/graphql",
    });
    useServer(
      {
        schema,
        context: (ctx) => {
          const decoded = jwt.decode(
            (ctx?.connectionParams?.Authorization as string | undefined) || ""
          );
          return {
            client,
            id: decoded && typeof decoded !== "string" ? decoded.id : "",
            isBorrower:
              decoded && typeof decoded !== "string" ? decoded.isBorrower : "",
            isLender:
              decoded && typeof decoded !== "string" ? decoded.isLender : "",
            isSupport:
              decoded && typeof decoded !== "string" ? decoded.isSupport : "",
          };
        },
      },
      wsServer
    );
  });
  const server = new Server();
  server.addService(AuthService, AuthServer(client));
  server.bindAsync(
    "backend-auth-node:1984",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
      server.start();
    }
  );
});
