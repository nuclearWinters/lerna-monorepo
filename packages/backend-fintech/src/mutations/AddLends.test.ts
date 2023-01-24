import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient } from "mongodb";
import { base64Name, jwt } from "../utils";

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
  const ch = { sendToQueue: jest.fn() };

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
    app.locals.ch = ch;
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
                term: 2,
                goal: "500.00",
                ROI: 10,
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
                term: 2,
                goal: "500.00",
                ROI: 10,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO31",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addLends.error).toBeFalsy();
    expect(ch.sendToQueue).toBeCalledTimes(2);
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
                term: 2,
                goal: "500.00",
                ROI: 10,
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "450.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
                term: 2,
                goal: "500.00",
                ROI: 10,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO31",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response2.body.data.addLends.error).toBeFalsy();
    expect(ch.sendToQueue).toBeCalledTimes(4);
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
                term: 2,
                goal: "500.00",
                ROI: 10,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO33",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addLends.error).toBe("");
    expect(ch.sendToQueue).toBeCalledTimes(5);
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
                term: 2,
                goal: "500.00",
                ROI: 10,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO35",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addLends.error).toBe("");
    expect(ch.sendToQueue).toBeCalledTimes(6);
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
                term: 2,
                goal: "500.00",
                ROI: 10,
              },
              {
                loan_gid: base64Name("600000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO38",
                term: 2,
                goal: "500.00",
                ROI: 10,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO37",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addLends.error).toBeFalsy();
    expect(ch.sendToQueue).toBeCalledTimes(8);
  });
});
