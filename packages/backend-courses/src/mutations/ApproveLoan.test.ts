import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";

const request = supertest(app);

describe("ApproveLoan tests", () => {
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
    await client.close();
  });

  it("test ApproveLoan valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000009"),
        accountAvailable: 100000,
        investments: [],
      },
      {
        _id: new ObjectId("000000000000000000000010"),
        accountAvailable: 100000,
        investments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertOne({
      _id: new ObjectId("000000000000000000000008"),
      _id_user: new ObjectId("000000000000000000000010"),
      score: "AAA",
      ROI: 17,
      goal: 100000,
      term: 2,
      raised: 0,
      expiry: new Date(),
      status: "waiting for approval",
      scheduledPayments: null,
      investors: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation ApproveLoanMutation($input: ApproveLoanInput!) {
          approveLoan(input: $input) {
            error
            validAccessToken
            loan {
              id
            }
          }
        }`,
        variables: {
          input: {
            loan_gid: base64Name("000000000000000000000008", "Loan"),
          },
        },
        operationName: "ApproveLoanMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000009", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.approveLoan.error).toBeFalsy();
    expect(response.body.data.approveLoan.validAccessToken).toBeTruthy();
    expect(response.body.data.approveLoan.loan).toBeTruthy();
    const allLoans = await loans
      .find({ _id: new ObjectId("000000000000000000000008") })
      .toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        ROI: loan.ROI,
        _id_user: loan._id_user.toHexString(),
        goal: loan.goal,
        raised: loan.raised,
        scheduledPayments: loan.scheduledPayments,
        score: loan.score,
        status: loan.status,
        term: loan.term,
      }))
    ).toEqual([
      {
        ROI: 17,
        _id_user: "000000000000000000000010",
        goal: 100000,
        raised: 0,
        scheduledPayments: null,
        score: "AAA",
        status: "financing",
        term: 2,
      },
    ]);
  });
});
