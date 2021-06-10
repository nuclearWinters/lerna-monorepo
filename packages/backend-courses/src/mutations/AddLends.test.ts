import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
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
    await client.close();
  });

  it("test AddLends valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000004"),
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        investments: [],
      },
      {
        _id: new ObjectId("000000000000000000000005"),
        name: "Luis Fernando",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        investments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("000000000000000000000002"),
        _id_user: new ObjectId("000000000000000000000005"),
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        investors: [],
      },
      {
        _id: new ObjectId("000000000000000000000003"),
        _id_user: new ObjectId("000000000000000000000005"),
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        investors: [],
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
                term: 2,
                goal: "500.00",
                ROI: 10,
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "000000000000000000000005",
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
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000004"),
    });
    expect(user?.accountAvailable).toBe(85000);
    expect(user?.investments).toEqual([
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000002"),
        payments: 0,
        quantity: 10000,
        term: 2,
      },
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000003"),
        payments: 0,
        quantity: 5000,
        term: 2,
      },
    ]);
    const allTransactions = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000004") })
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
        type: "invest",
        quantity: 10000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ _id_user: new ObjectId("000000000000000000000005") })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        investors: loan.investors.map((investor) => ({
          ...investor,
          _id_lender: investor._id_lender.toHexString(),
        })),
      }))
    ).toEqual([
      {
        raised: 10000,
        status: "financing",
        investors: [
          {
            _id_lender: "000000000000000000000004",
            quantity: 10000,
          },
        ],
      },
      {
        raised: 5000,
        status: "financing",
        investors: [
          {
            _id_lender: "000000000000000000000004",
            quantity: 5000,
          },
        ],
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ _id_lender: new ObjectId("000000000000000000000004") })
      .toArray();
    expect(allInvestments.length).toBe(2);
    expect(
      allInvestments.map((investment) => ({
        quantity: investment.quantity,
        payments: investment.payments,
        term: investment.term,
        moratory: investment.moratory,
        ROI: investment.ROI,
      }))
    ).toEqual([
      {
        quantity: 10000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
      },
      {
        quantity: 5000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
      },
    ]);
    const response2 = await request
      .post("/api/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
                term: 2,
                goal: "500.00",
                ROI: 10,
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "450.00",
                borrower_id: "000000000000000000000005",
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
    const user2 = await users.findOne({
      _id: new ObjectId("000000000000000000000004"),
    });
    expect(user2?.accountAvailable).toBe(0);
    expect(user2?.investments).toEqual([
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000002"),
        payments: 0,
        quantity: 10000,
        term: 2,
      },
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000003"),
        payments: 0,
        quantity: 5000,
        term: 2,
      },
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000002"),
        payments: 0,
        quantity: 40000,
        term: 2,
      },
      {
        ROI: 10,
        _id_loan: new ObjectId("000000000000000000000003"),
        payments: 0,
        quantity: 45000,
        term: 2,
      },
    ]);
    const allTransactions2 = await transactions
      .find({ _id_user: new ObjectId("000000000000000000000004") })
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
        type: "invest",
        quantity: 10000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
      {
        type: "invest",
        quantity: 40000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 45000,
        _id_borrower: "000000000000000000000005",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans2 = await loans
      .find({ _id_user: new ObjectId("000000000000000000000005") })
      .toArray();
    expect(allLoans2.length).toBe(2);
    expect(
      allLoans2.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        investors: loan.investors.map((investor) => ({
          ...investor,
          _id_lender: investor._id_lender.toHexString(),
        })),
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
        investors: [
          {
            _id_lender: "000000000000000000000004",
            quantity: 10000,
          },
          {
            _id_lender: "000000000000000000000004",
            quantity: 40000,
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
        investors: [
          {
            _id_lender: "000000000000000000000004",
            quantity: 5000,
          },
          {
            _id_lender: "000000000000000000000004",
            quantity: 45000,
          },
        ],
      },
    ]);
    const investments2 = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments2 = await investments2
      .find({ _id_lender: new ObjectId("000000000000000000000004") })
      .toArray();
    expect(allInvestments2.length).toBe(2);
    expect(
      allInvestments2.map((investment) => ({
        quantity: investment.quantity,
        payments: investment.payments,
        term: investment.term,
        moratory: investment.moratory,
        ROI: investment.ROI,
      }))
    ).toEqual([
      {
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
      },
      {
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
      },
    ]);
  });
});
