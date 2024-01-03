import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "../types";
import { jwt } from "../utils";
import { UserTransaction } from "../kafkaUserTransaction";
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

describe("AddFunds tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let producer: Producer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: ["kafka:9092"],
    });
    producer = kafka.producer();
    await producer.connect();
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
    app.locals.producer = producer;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test AddFunds increase valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const _id = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO25";
    await users.insertOne({
      _id,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    await UserTransaction(
      JSON.stringify({
        user_id: id,
        quantity: 50000,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBeFalsy();
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id,
      id,
      account_available: 150000,
      account_to_be_paid: 0,
      account_total: 150000,
      account_withheld: 0,
    });
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
      }))
    ).toEqual([
      {
        type: "credit",
        quantity: 50000,
      },
    ]);
  });

  it("test AddFunds decrease valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const user_oid = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO26";
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    await UserTransaction(
      JSON.stringify({
        user_id: id,
        quantity: -50000,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "-500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
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
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBeFalsy();
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 50000,
      account_to_be_paid: 0,
      account_total: 50000,
      account_withheld: 0,
    });
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
      }))
    ).toEqual([
      {
        type: "withdrawal",
        quantity: -50000,
      },
    ]);
  });

  it("test AddFunds increase invalid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const user_oid = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO27";
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    await UserTransaction(
      JSON.stringify({
        user_id: id,
        quantity: 50000,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "0s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBeFalsy();
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 150000,
      account_to_be_paid: 0,
      account_total: 150000,
      account_withheld: 0,
    });
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
      }))
    ).toEqual([
      {
        type: "credit",
        quantity: 50000,
      },
    ]);
  });

  it("test AddFunds try decrease more than available valid refresh token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const user_oid = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO29";
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    await UserTransaction(
      JSON.stringify({
        user_id: id,
        quantity: -150000,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "-1500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBe("");
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(0);
  });

  it("test AddFunds try increase cero valid refresh token", async () => {
    const user_oid = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO30";
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "0.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBe(
      "La cantidad no puede ser cero."
    );
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });

    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(0);
  });
});
