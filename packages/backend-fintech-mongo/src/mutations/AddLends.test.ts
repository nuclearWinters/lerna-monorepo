import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient } from "mongodb";
import { base64Name, jwt } from "../utils";
jest.mock("kafkajs", () => {
  return {
    Kafka: function () {
      return {
        producer: () => ({
          send: jest.fn(),
          connect: () => Promise.resolve(jest.fn()),
        }),
      };
    },
  };
});
import { Kafka, Producer } from "kafkajs";

jest.mock("../subscriptions/subscriptionsUtils", () => ({
  publishUser: jest.fn,
  publishTransactionInsert: jest.fn,
  publishLoanUpdate: jest.fn,
  publishInvestmentUpdate: jest.fn,
}));

jest.mock("graphql-redis-subscriptions", () => ({
  RedisPubSub: jest.fn().mockImplementation(() => {
    return {};
  }),
}));

jest.mock("ioredis", () =>
  jest.fn().mockImplementation(() => {
    return {};
  })
);

const request = supertest(app);

describe("AddLends tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let producer: Producer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: ["kafka:9092"],
    });
    producer = kafka.producer();
    await producer.connect();
    app.locals.db = dbInstance;
    app.locals.producer = producer;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test AddLends valid access token", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "100.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO31",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          {
            expiresIn: "15m",
          }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO31`);
    expect(response.body.data.addLends.error).toBeFalsy();
    expect(producer.send).toHaveBeenCalledTimes(2);
    const response2 = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "400.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "450.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO31",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          {
            expiresIn: "15m",
          }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO31`);
    expect(response2.body.data.addLends.error).toBeFalsy();
    expect(producer.send).toHaveBeenCalledTimes(4);
  });

  it("test AddLends not enough money valid access token", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("400000000000000000000002", "Loan"),
                quantity: "150.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO34",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO33",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO33`);
    expect(response.body.data.addLends.error).toBe("");
    expect(producer.send).toHaveBeenCalledTimes(5);
  });

  it("test AddLends no investments done valid access token", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("500000000000000000000002", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO36",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO35",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO35`);
    expect(response.body.data.addLends.error).toBe("");
    expect(producer.send).toHaveBeenCalledTimes(6);
  });

  it("test AddLends not all investments are done valid access token", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("600000000000000000000002", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO38",
              },
              {
                loan_gid: base64Name("600000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO38",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO37",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO37`);
    expect(response.body.data.addLends.error).toBeFalsy();
    expect(producer.send).toHaveBeenCalledTimes(8);
  });
});
