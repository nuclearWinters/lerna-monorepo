import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectID } from "mongodb";
import {
  BucketTransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";

const request = supertest(app);

describe("AddLends tests", () => {
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
    await dbInstance.collection<UserMongo>("users").deleteMany({
      _id: {
        $in: [
          new ObjectID("000000000000000000000004"),
          new ObjectID("000000000000000000000005"),
        ],
      },
    });
    await dbInstance
      .collection<BucketTransactionMongo>("transactions")
      .deleteMany({ _id_user: new ObjectID("000000000000000000000004") });
    await dbInstance
      .collection<InvestmentMongo>("investments")
      .deleteMany({ _id_lender: new ObjectID("000000000000000000000004") });
    await dbInstance
      .collection<LoanMongo>("loans")
      .deleteMany({ _id_user: new ObjectID("000000000000000000000005") });
    await client.close();
  });

  it("test AddLends valid access token", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectID("000000000000000000000004"),
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        accountTotal: 100000,
      },
      {
        _id: new ObjectID("000000000000000000000005"),
        name: "Luis Fernando",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        accountTotal: 100000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectID("000000000000000000000002"),
        _id_user: new ObjectID("000000000000000000000005"),
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
      },
      {
        _id: new ObjectID("000000000000000000000003"),
        _id_user: new ObjectID("000000000000000000000005"),
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
      },
    ]);
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
            user {
              accountAvailable
              accountTotal
            }
          }
        }`,
        variables: {
          input: {
            lender_gid: base64Name("000000000000000000000004", "User"),
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "100.00",
                borrower_id: "000000000000000000000005",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "000000000000000000000005",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000004", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.addLends.error).toBeFalsy();
    expect(response.body.data.addLends.validAccessToken).toBeTruthy();
    expect(response.body.data.addLends.user.accountAvailable).toBe("850.00");
    expect(response.body.data.addLends.user.accountTotal).toBe("1000.00");
    const allTransactions = await transactions
      .find({ _id_user: new ObjectID("000000000000000000000004") })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(allTransactions[0].history.length).toBe(2);
    expect(
      allTransactions[0].history.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        _id_borrower: transaction._id_borrower?.toHexString(),
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "INVEST",
        quantity: 10000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "INVEST",
        quantity: 5000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ _id_user: new ObjectID("000000000000000000000005") })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
      }))
    ).toEqual([
      {
        raised: 10000,
        status: "financing",
      },
      {
        raised: 5000,
        status: "financing",
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ _id_lender: new ObjectID("000000000000000000000004") })
      .toArray();
    expect(allInvestments.length).toBe(2);
    expect(
      allInvestments.map((investment) => ({
        quantity: investment.quantity,
      }))
    ).toEqual([
      {
        quantity: 10000,
      },
      {
        quantity: 5000,
      },
    ]);
    const response2 = await request
      .post("/api/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
            user {
              accountAvailable
              accountTotal
            }
          }
        }`,
        variables: {
          input: {
            lender_gid: base64Name("000000000000000000000004", "User"),
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "400.00",
                borrower_id: "000000000000000000000005",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "450.00",
                borrower_id: "000000000000000000000005",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000004", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response2.body.data.addLends.error).toBeFalsy();
    expect(response2.body.data.addLends.validAccessToken).toBeTruthy();
    expect(response2.body.data.addLends.user.accountAvailable).toBe("0.00");
    expect(response2.body.data.addLends.user.accountTotal).toBe("1000.00");
    const allTransactions2 = await transactions
      .find({ _id_user: new ObjectID("000000000000000000000004") })
      .toArray();
    expect(allTransactions2.length).toBe(1);
    expect(allTransactions2[0].history.length).toBe(4);
    expect(
      allTransactions2[0].history.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        _id_borrower: transaction._id_borrower?.toHexString(),
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "INVEST",
        quantity: 10000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "INVEST",
        quantity: 5000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
      {
        type: "INVEST",
        quantity: 40000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "INVEST",
        quantity: 45000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans2 = await loans
      .find({ _id_user: new ObjectID("000000000000000000000005") })
      .toArray();
    expect(allLoans2.length).toBe(2);
    expect(
      allLoans2.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        scheduledPayments: loan.scheduledPayments?.map((payment) => ({
          amortize: payment.amortize,
          status: payment.status,
        })),
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],
      },
      {
        raised: 50000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],
      },
    ]);
    const investments2 = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments2 = await investments2
      .find({ _id_lender: new ObjectID("000000000000000000000004") })
      .toArray();
    expect(allInvestments2.length).toBe(2);
    expect(
      allInvestments2.map((investment) => ({
        quantity: investment.quantity,
      }))
    ).toEqual([
      {
        quantity: 50000,
      },
      {
        quantity: 50000,
      },
    ]);
    done();
  });
});
