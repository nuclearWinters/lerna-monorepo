import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectID } from "mongodb";
import { UserMongo } from "./types";
import { jwt } from "./utils";
import { ACCESSSECRET } from "./config";

const request = supertest(app);

describe("QueryTransactions tests", () => {
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
      .deleteMany({ _id: new ObjectID("000000000000000000000060") });
    await client.close();
  });

  it("test TransactionsConnection valid access token", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectID("000000000000000000000060"),
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "RFC",
        CURP: "CURP",
        clabe: "clabe",
        mobile: "mobile",
        accountAvailable: 50000,
        accountTotal: 50000,
      },
    ]);
    const response = await request
      .post("/api/graphql")
      .send({
        query: `query GetUser($id: String!) {
          user(id: $id) {
            id
            name
            apellidoPaterno
            apellidoMaterno
            RFC
            CURP
            clabe
            mobile
            accountAvailable
            accountTotal
          }  
        }`,
        variables: {
          id: "000000000000000000000060",
        },
        operationName: "GetUser",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000060", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.user.id).toBeTruthy();
    expect(response.body.data.user.name).toBe("Armando Narcizo");
    expect(response.body.data.user.apellidoPaterno).toBe("Rueda");
    expect(response.body.data.user.apellidoMaterno).toBe("Peréz");
    expect(response.body.data.user.RFC).toBe("RFC");
    expect(response.body.data.user.CURP).toBe("CURP");
    expect(response.body.data.user.clabe).toBe("clabe");
    expect(response.body.data.user.mobile).toBe("mobile");
    expect(response.body.data.user.accountAvailable).toBe("500.00");
    expect(response.body.data.user.accountTotal).toBe("500.00");
    done();
  });
});
