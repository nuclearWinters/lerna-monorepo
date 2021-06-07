import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { InvestmentMongo } from "./types";
import { jwt } from "./utils";
import { ACCESSSECRET } from "./config";

const request = supertest(app);

describe("QueryInvestments tests", () => {
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
      .collection<InvestmentMongo>("investments")
      .deleteMany({ _id_lender: new ObjectId("000000000000000000000030") });
    await client.close();
  });

  it("test InvestmentConnection valid access token", async (done) => {
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    await investments.insertMany([
      {
        _id: new ObjectId("000000000000000000000032"),
        _id_borrower: new ObjectId("000000000000000000000031"),
        _id_lender: new ObjectId("000000000000000000000030"),
        _id_loan: new ObjectId("000000000000000000000033"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 3,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000034"),
        _id_borrower: new ObjectId("000000000000000000000037"),
        _id_lender: new ObjectId("000000000000000000000030"),
        _id_loan: new ObjectId("000000000000000000000038"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 50000,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000035"),
        _id_borrower: new ObjectId("000000000000000000000036"),
        _id_lender: new ObjectId("000000000000000000000030"),
        _id_loan: new ObjectId("000000000000000000000039"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 50000,
        ROI: 17,
        moratory: 0,
      },
    ]);
    const response = await request
      .post("/api/graphql")
      .send({
        query: `query GetInvestmentsConnection($first: Int, $after: String, $user_id: String!) {
          investments(first: $first, after: $after, user_id: $user_id) {
            edges {
              cursor
              node {
                id
                _id_borrower
                _id_lender
                _id_loan
                quantity
                created
                updated
                status
              }
            }
          }  
        }`,
        variables: {
          first: 2,
          after: "",
          user_id: "000000000000000000000030",
        },
        operationName: "GetInvestmentsConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000030", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.investments.edges.length).toBe(2);
    expect(response.body.data.investments.edges[0].cursor).toBeTruthy();
    expect(response.body.data.investments.edges[0].node.id).toBeTruthy();
    expect(
      response.body.data.investments.edges[0].node._id_borrower
    ).toBeTruthy();
    expect(
      response.body.data.investments.edges[0].node._id_lender
    ).toBeTruthy();
    expect(response.body.data.investments.edges[0].node._id_loan).toBeTruthy();
    expect(response.body.data.investments.edges[0].node.quantity).toBe(50000);
    expect(response.body.data.investments.edges[0].node.created).toBeTruthy();
    expect(response.body.data.investments.edges[0].node.updated).toBeTruthy();
    expect(response.body.data.investments.edges[0].node.status).toBe(
      "UP_TO_DATE"
    );
    done();
  });
});
