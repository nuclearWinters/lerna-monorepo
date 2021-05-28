import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectID } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";

const request = supertest(app);

describe("AddLoan tests", () => {
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
      .deleteMany({ _id: new ObjectID("000000000000000000000006") });
    await dbInstance
      .collection<LoanMongo>("loans")
      .deleteMany({ _id_user: new ObjectID("000000000000000000000006") });
    await client.close();
  });

  it("test AddLoan valid access token", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectID("000000000000000000000006"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 100000,
      accountTotal: 100000,
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation AddLoanMutation($input: AddLoanInput!) {
          addLoan(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000006", "User"),
            goal: "1000.00",
            term: 2,
          },
        },
        operationName: "AddLoanMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000006", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addLoan.error).toBeFalsy();
    expect(response.body.data.addLoan.validAccessToken).toBeTruthy();
    const loans = dbInstance.collection<LoanMongo>("loans");
    const allLoans = await loans
      .find({ _id_user: new ObjectID("000000000000000000000006") })
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
        _id_user: "000000000000000000000006",
        goal: 100000,
        raised: 0,
        scheduledPayments: null,
        score: "AAA",
        status: "waiting for approval",
        term: 2,
      },
    ]);
    done();
  });
});
