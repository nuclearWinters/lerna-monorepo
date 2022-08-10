import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BucketTransactionMongo, UserMongo } from "../types";
import { jwt } from "../utils";
import { client as grpcClient } from "../utils";
import { Metadata } from "@grpc/grpc-js";
import { SurfaceCall } from "@grpc/grpc-js/build/src/call";

const request = supertest(app);

describe("AddFunds tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test AddFunds increase valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000000"),
      id: "wHHR1SUBT0dspoF4YUO25",
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO25",
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
            id: "wHHR1SUBT0dspoF4YUO25",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO25",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000000"),
      id: "wHHR1SUBT0dspoF4YUO25",
      accountAvailable: 150000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO25" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions[0].history.length).toBe(1);
    expect(
      allTransactions[0].history.map((transaction) => ({
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
    await users.insertOne({
      _id: new ObjectId("020000000000000000000003"),
      id: "wHHR1SUBT0dspoF4YUO26",
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO26",
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
            id: "wHHR1SUBT0dspoF4YUO26",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO26",
    });
    expect(user).toEqual({
      _id: new ObjectId("020000000000000000000003"),
      id: "wHHR1SUBT0dspoF4YUO26",
      accountAvailable: 50000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO26" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions[0].history.length).toBe(1);
    expect(
      allTransactions[0].history.map((transaction) => ({
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
    await users.insertOne({
      _id: new ObjectId("000000000000000000000001"),
      id: "wHHR1SUBT0dspoF4YUO27",
      accountAvailable: 100000,
      investments: [],
    });
    jest
      .spyOn(grpcClient, "renewAccessToken")
      .mockImplementationOnce((_request, callback: unknown) => {
        const callbackTyped = callback as (
          error: null,
          response: { getValidaccesstoken: () => string }
        ) => void;
        callbackTyped(null, {
          getValidaccesstoken: () =>
            jwt.sign(
              {
                id: "wHHR1SUBT0dspoF4YUO27",
                isBorrower: false,
                isLender: true,
                isSupport: false,
              },
              "ACCESSSECRET",
              {
                expiresIn: "15m",
              }
            ),
        });
        return {} as SurfaceCall;
      });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO27",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "0s" }
        )
      )
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO27",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO27",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000001"),
      id: "wHHR1SUBT0dspoF4YUO27",
      accountAvailable: 150000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO27" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions[0].history.length).toBe(1);
    expect(
      allTransactions[0].history.map((transaction) => ({
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

  it("test AddFunds increase invalid refresh token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000002"),
      id: "wHHR1SUBT0dspoF4YUO28",
      accountAvailable: 100000,
      investments: [],
    });
    jest
      .spyOn(grpcClient, "renewAccessToken")
      .mockImplementationOnce((_request, callback: unknown) => {
        const callbackTyped = callback as (error: {
          name: string;
          message: string;
          code: number;
          details: string;
          metadata: Metadata;
        }) => void;
        callbackTyped({
          name: "Error Auth Service",
          message: "Error",
          code: 1,
          details: "",
          metadata: new Metadata(),
        });
        return {} as SurfaceCall;
      });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO28",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "0s" }
        )
      )
      .set("Cookie", `refreshToken=invalid`);
    expect(response.body.data.addFunds.error).toBe("No valid access token.");
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO28",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000002"),
      id: "wHHR1SUBT0dspoF4YUO28",
      accountAvailable: 100000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000002") })
      .toArray();
    expect(allTransactions.length).toBe(0);
  });

  it("test AddFunds try decrease more than available valid refresh token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("100000000000000000000002"),
      id: "wHHR1SUBT0dspoF4YUO29",
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO29",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO29",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addFunds.error).toBe(
      "No cuentas con fondos suficientes."
    );
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO29",
    });
    expect(user).toEqual({
      _id: new ObjectId("100000000000000000000002"),
      id: "wHHR1SUBT0dspoF4YUO29",
      accountAvailable: 100000,
      investments: [],
    });

    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("100000000000000000000002") })
      .toArray();
    expect(allTransactions.length).toBe(0);
  });

  it("test AddFunds try increase cero valid refresh token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("100000000000000000000003"),
      id: "wHHR1SUBT0dspoF4YUO30",
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
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
            id: "wHHR1SUBT0dspoF4YUO30",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO30",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addFunds.error).toBe(
      "La cantidad no puede ser cero."
    );
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO30",
    });
    expect(user).toEqual({
      _id: new ObjectId("100000000000000000000003"),
      id: "wHHR1SUBT0dspoF4YUO30",
      accountAvailable: 100000,
      investments: [],
    });

    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("100000000000000000000003") })
      .toArray();
    expect(allTransactions.length).toBe(0);
  });
});
