import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "../types";
import { base64Name, jwt } from "../utils";

jest.mock("../subscriptions/subscriptionsUtils", () => ({
  publishUser: jest.fn,
  publishTransactionInsert: jest.fn,
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

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
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
        id: "wHHR1SUBT0dspoF4YUO31",
        accountAvailable: 100000,
        accountLent: 0,
        accountInterests: 0,
        accountTotal: 100000,
      },
      {
        _id: new ObjectId("000000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO32",
        accountAvailable: 100000,
        accountLent: 0,
        accountInterests: 0,
        accountTotal: 100000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("000000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
      {
        _id: new ObjectId("000000000000000000000003"),
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
    expect(response.body.data.addLends.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 85000,
      accountLent: 15000,
      accountInterests: 0,
      accountTotal: 100000,
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions.length).toBe(2);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO32" })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 10000,
        status: "financing",
        pending: 40000,
      },
      {
        raised: 5000,
        status: "financing",
        pending: 45000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments.length).toBe(2);
    expect(
      allInvestments.map((investment) => ({
        quantity: investment.quantity,
        payments: investment.payments,
        term: investment.term,
        moratory: investment.moratory,
        ROI: investment.ROI,
        interest_to_earn: investment.interest_to_earn,
        still_invested: investment.still_invested,
        amortize: investment.amortize,
        paid_already: investment.paid_already,
      }))
    ).toEqual([
      {
        quantity: 10000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        still_invested: 10000,
        paid_already: 0,
        amortize: 0,
      },
      {
        quantity: 5000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 0,
        still_invested: 5000,
        paid_already: 0,
        amortize: 0,
      },
    ]);
    const response2 = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
    expect(response2.body.data.addLends.validAccessToken).toBeTruthy();
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 0,
      accountLent: 100000,
      accountInterests: 1196,
      accountTotal: 101196,
    });
    const user3 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO32",
    });
    expect(user3).toEqual({
      _id: new ObjectId("000000000000000000000005"),
      id: "wHHR1SUBT0dspoF4YUO32",
      accountAvailable: 200000,
      accountLent: 0,
      accountInterests: 0,
      accountTotal: 200000,
    });
    const allTransactions2 = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions2.length).toBe(4);
    expect(
      allTransactions2.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
      {
        type: "invest",
        quantity: 40000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 45000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans2 = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO32" })
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
        pending: loan.pending,
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
        pending: 0,
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
        pending: 0,
      },
    ]);
    const investments2 = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments2 = await investments2
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments2.length).toBe(2);
    expect(
      allInvestments2.map((investment) => ({
        quantity: investment.quantity,
        payments: investment.payments,
        term: investment.term,
        moratory: investment.moratory,
        ROI: investment.ROI,
        interest_to_earn: investment.interest_to_earn,
        still_invested: investment.still_invested,
        amortize: investment.amortize,
        paid_already: investment.paid_already,
      }))
    ).toEqual([
      {
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        still_invested: 50598,
        amortize: 25299,
        paid_already: 0,
      },
      {
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        still_invested: 50598,
        amortize: 25299,
        paid_already: 0,
      },
    ]);
  });

  it("test AddLends not enough money valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("400000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO33",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("400000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO34",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("400000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO34",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
    expect(response.body.data.addLends.error).toBe(
      "No se tienen suficientes fondos."
    );
    expect(response.body.data.addLends.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO33",
    });
    expect(user).toEqual({
      _id: new ObjectId("400000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO33",
      accountAvailable: 10000,
      accountLent: 0,
      accountInterests: 0,
      accountTotal: 10000,
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO33" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO34" })
      .toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 0,
        status: "financing",
        pending: 50000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO33" })
      .toArray();
    expect(allInvestments.length).toBe(0);
  });

  it("test AddLends no investments done valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("500000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO35",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("500000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO36",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("500000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO36",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: new Date(),
        status: "to be paid",
        scheduledPayments: null,
        pending: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
    expect(response.body.data.addLends.error).toBe(
      "Error: no se realizó ninguna operación. Intenta de nuevo."
    );
    expect(response.body.data.addLends.validAccessToken).toBeFalsy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO35",
    });
    expect(user).toEqual({
      _id: new ObjectId("500000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO35",
      accountAvailable: 10000,
      accountLent: 0,
      accountInterests: 0,
      accountTotal: 10000,
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO35" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO36" })
      .toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        pending: 0,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO35" })
      .toArray();
    expect(allInvestments.length).toBe(0);
  });

  it("test AddLends not all investments are done valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("600000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO37",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("600000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO38",
        accountAvailable: 10000,
        accountInterests: 0,
        accountLent: 0,
        accountTotal: 10000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("600000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: new Date(),
        status: "to be paid",
        scheduledPayments: null,
        pending: 0,
      },
      {
        _id: new ObjectId("600000000000000000000003"),
        id_user: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation addLendsMutation($input: AddLendsInput!) {
          addLends(input: $input) {
            error
            validAccessToken
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
    expect(response.body.data.addLends.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO37",
    });
    expect(user).toEqual({
      _id: new ObjectId("600000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO37",
      accountAvailable: 5000,
      accountLent: 5000,
      accountInterests: 0,
      accountTotal: 10000,
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO38",
        _id_loan: "600000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO38" })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        pending: 0,
      },
      {
        raised: 5000,
        status: "financing",
        pending: 45000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(
      allInvestments.map((investment) => ({
        quantity: investment.quantity,
        payments: investment.payments,
        term: investment.term,
        moratory: investment.moratory,
        ROI: investment.ROI,
        interest_to_earn: investment.interest_to_earn,
        still_invested: investment.still_invested,
        amortize: investment.amortize,
        paid_already: investment.paid_already,
      }))
    ).toEqual([
      {
        quantity: 5000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        still_invested: 5000,
        paid_already: 0,
        amortize: 0,
      },
    ]);
  });
});
