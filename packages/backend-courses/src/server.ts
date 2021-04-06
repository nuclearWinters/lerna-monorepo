import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { MONGO_DB } from "./config";
import { UserQuery } from "./QueryUser";
import { MongoClient, Db } from "mongodb";
import { UserDB, Context } from "./types";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: UserQuery,
  },
});

const schema = new GraphQLSchema({
  query: Query,
});

const app = express();

app.use(cors());

app.use((req) => {
  req.next && req.next();
});

app.get("/api/", (req, res) => {
  res.json({ hola: "Hola esto con hot reload funciona" });
});

app.get("/api/random", (req, res) => {
  res.json({ random: "random" });
});

const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(
  "/graphql",
  graphqlHTTP((req: any): {
    context: Context;
    schema: GraphQLSchema;
    graphiql: boolean;
  } => {
    const db = req.app.locals.db as Db;
    const usersCollection = db.collection<UserDB>("users");
    return {
      schema: schema,
      graphiql: true,
      context: {
        usersCollection,
      },
    };
  })
);

MongoClient.connect(MONGO_DB, menuOptions).then((client) => {
  const db = client.db("courses");
  app.locals.db = db;
  app.listen(process.env.PORT || 4000);
});
