import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BucketTransactionMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";
import { client as grpcClient } from "../utils";
import { Metadata } from "@grpc/grpc-js";

const request = supertest(app);

describe("AddFunds tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    delete app.locals.db;
    await dbInstance
      .collection<UserMongo>("users")
      .deleteMany({ _id: new ObjectId("000000000000000000000000") });
    await dbInstance
      .collection<BucketTransactionMongo>("transactions")
      .deleteMany({ _id_user: new ObjectId("000000000000000000000000") });
    await client.close();
  });

  it("test AddFunds increase valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000000"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
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
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
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
        type: "CREDIT",
        quantity: 50000,
      },
    ]);
  });

  it("test AddFunds decrease valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000003"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
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
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
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
        type: "WITHDRAWAL",
        quantity: -50000,
      },
    ]);
  });

  it("test AddFunds increase invalid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000001"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
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
              ACCESSSECRET,
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
            ACCESSSECRET,
            { expiresIn: "0s" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeFalsy();
    expect(response.body.data.addFunds.validAccessToken).toBeTruthy();
  });

  it("test AddFunds increase invalid refresh token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000002"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 100000,
      investments: [],
    });
    jest
      .spyOn(grpcClient, "renewAccessToken")
      .mockImplementationOnce((request, callback: any) => {
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
            ACCESSSECRET,
            { expiresIn: "0s" }
          ),
          refreshToken: "invalidRefreshToken",
        })
      );
    expect(response.body.data.addFunds.error).toBeTruthy();
    expect(response.body.data.addFunds.validAccessToken).toBeFalsy();
  });
});
