import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BucketTransactionMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { client as grpcClient } from "../utils";
import { ClientUnaryCall, Metadata } from "@grpc/grpc-js";

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
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000000", "User"),
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000000", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000000"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000000"),
      accountAvailable: 150000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000000") })
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
      _id: new ObjectId("000000000000000000000003"),
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000003", "User"),
            quantity: "-500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000003", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000003"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000003"),
      accountAvailable: 50000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000003") })
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
      accountAvailable: 100000,
      investments: [],
    });
    jest
      .spyOn(grpcClient, "renewAccessToken")
      .mockImplementationOnce((request, callback: any) => {
        callback(null, {
          getValidaccesstoken: () =>
            jwt.sign(
              { _id: "000000000000000000000001", email: "" },
              "ACCESSSECRET",
              {
                expiresIn: "15m",
              }
            ),
        } as any);
        return {} as any;
      });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000001", "User"),
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000001", email: "" },
            "ACCESSSECRET",
            { expiresIn: "0s" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000001"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000001"),
      accountAvailable: 150000,
      investments: [],
    });
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000001") })
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
      accountAvailable: 100000,
      investments: [],
    });
    jest
      .spyOn(grpcClient, "renewAccessToken")
      .mockImplementationOnce((_request, callback: any) => {
        callback(
          {
            name: "Error Auth Service",
            message: "Error",
            code: 1,
            details: "",
            metadata: new Metadata(),
          },
          null
        );
        return {} as ClientUnaryCall;
      });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000002", "User"),
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000002", email: "" },
            "ACCESSSECRET",
            { expiresIn: "0s" }
          ),
          refreshToken: "invalidRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBe("Error");
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000002"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000002"),
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
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("100000000000000000000002", "User"),
            quantity: "-1500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "100000000000000000000002", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15s" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBe(
      "No cuentas con fondos suficientes."
    );
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      _id: new ObjectId("100000000000000000000002"),
    });
    expect(user).toEqual({
      _id: new ObjectId("100000000000000000000002"),
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
      accountAvailable: 100000,
      investments: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("100000000000000000000003", "User"),
            quantity: "0.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "100000000000000000000003", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15s" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBe(
      "La cantidad no puede ser cero."
    );
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      _id: new ObjectId("100000000000000000000003"),
    });
    expect(user).toEqual({
      _id: new ObjectId("100000000000000000000003"),
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
