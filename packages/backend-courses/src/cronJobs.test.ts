import { addMonths, addSeconds, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectID } from "mongodb";
import { dayFunction, monthFunction } from "./cronJobs";
import { BucketTransactionMongo, LoanMongo, UserMongo } from "./types";

describe("cronJobs tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("fintech");
  });

  afterAll(async () => {
    await dbInstance.collection<UserMongo>("users").deleteMany({
      _id: {
        $in: [
          new ObjectID("000000000000000000000013"),
          new ObjectID("000000000000000000000011"),
        ],
      },
    });
    await dbInstance.collection<LoanMongo>("loans").deleteMany({
      _id_user: {
        $in: [
          new ObjectID("000000000000000000000013"),
          new ObjectID("000000000000000000000011"),
        ],
      },
    });
    await dbInstance
      .collection<BucketTransactionMongo>("transactions")
      .deleteMany({
        _id_user: {
          $in: [
            new ObjectID("000000000000000000000013"),
            new ObjectID("000000000000000000000011"),
          ],
        },
      });
    await client.close();
  });

  it("dayFunction test", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    await users.insertOne({
      _id: new ObjectID("000000000000000000000011"),
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
    await loans.insertOne({
      _id: new ObjectID("000000000000000000000012"),
      _id_user: new ObjectID("000000000000000000000011"),
      score: "AAA",
      ROI: 17,
      goal: 100000,
      expiry: new Date(),
      term: 3,
      raised: 100000,
      status: "to be paid",
      scheduledPayments: [
        {
          amortize: 342,
          scheduledDate: startOfDay(new Date("2020-12-01")),
          status: "delayed",
        },
        {
          amortize: 342,
          scheduledDate: startOfDay(new Date("2021-01-01")),
          status: "delayed",
        },

        {
          amortize: 342,
          scheduledDate: startOfDay(new Date("2021-02-01")),
          status: "to be paid",
        },
      ],
    });
    const clock = jest.useFakeTimers("modern");
    clock.setSystemTime(
      addSeconds(startOfDay(new Date("2021-02-02")), -1).getTime()
    );
    const promise = dayFunction(dbInstance);
    clock.advanceTimersByTime(2000);
    await promise;
    clock.useRealTimers();
    const user = await users.findOne({
      _id: new ObjectID("000000000000000000000011"),
    });
    expect({ ...user, _id: "" }).toEqual({
      _id: "",
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 99301,
      accountTotal: 99301,
    });
    const allTransactions = await transactions
      .find({
        _id_user: new ObjectID("000000000000000000000011"),
      })
      .toArray();
    expect(allTransactions.length).toEqual(1);
    expect(allTransactions[0].history.length).toEqual(2);
    expect(
      allTransactions[0].history.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
        _id_borrower: "",
        _id_loan: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        _id_borrower: "",
        _id_loan: "",
        quantity: -352,
        type: "PAYMENT",
      },
      {
        _id: "",
        created: "",
        _id_borrower: "",
        _id_loan: "",
        quantity: -347,
        type: "PAYMENT",
      },
    ]);
    const allLoans = await loans
      .find({
        _id_user: new ObjectID("000000000000000000000011"),
      })
      .toArray();
    expect(allLoans.length).toEqual(1);
    expect(
      allLoans.map((loan) => ({
        status: loan.status,
        scheduledPayments: loan.scheduledPayments?.map((payment) => ({
          ...payment,
          scheduledDate: "",
        })),
      }))
    ).toEqual([
      {
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 342,
            status: "paid",
            scheduledDate: "",
          },
          {
            amortize: 342,
            status: "paid",
            scheduledDate: "",
          },
          {
            amortize: 342,
            status: "to be paid",
            scheduledDate: "",
          },
        ],
      },
    ]);
    done();
  });

  it("monthFunction test", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    await users.insertOne({
      _id: new ObjectID("000000000000000000000013"),
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
    await loans.insertOne({
      _id: new ObjectID("000000000000000000000014"),
      _id_user: new ObjectID("000000000000000000000013"),
      score: "AAA",
      ROI: 17,
      goal: 100000,
      expiry: new Date(),
      term: 3,
      raised: 100000,
      status: "to be paid",
      scheduledPayments: [
        {
          amortize: 342,
          scheduledDate: addMonths(startOfDay(new Date()), -2),
          status: "paid",
        },
        {
          amortize: 342,
          scheduledDate: addMonths(startOfDay(new Date()), -1),
          status: "paid",
        },

        {
          amortize: 342,
          scheduledDate: startOfDay(new Date()),
          status: "to be paid",
        },
      ],
    });
    await monthFunction(dbInstance);
    const user = await users.findOne({
      _id: new ObjectID("000000000000000000000013"),
    });
    expect({ ...user, _id: "" }).toEqual({
      _id: "",
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 99658,
      accountTotal: 99658,
    });
    const allTransactions = await transactions
      .find({
        _id_user: new ObjectID("000000000000000000000013"),
      })
      .toArray();
    expect(allTransactions.length).toEqual(1);
    expect(allTransactions[0].history.length).toEqual(1);
    expect(
      allTransactions[0].history.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
        _id_borrower: "",
        _id_loan: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        _id_borrower: "",
        _id_loan: "",
        quantity: -342,
        type: "PAYMENT",
      },
    ]);
    const allLoans = await loans
      .find({
        _id_user: new ObjectID("000000000000000000000013"),
      })
      .toArray();
    expect(allLoans.length).toEqual(1);
    expect(
      allLoans.map((loan) => ({
        status: loan.status,
        scheduledPayments: loan.scheduledPayments?.map((payment) => ({
          ...payment,
          scheduledDate: "",
        })),
      }))
    ).toEqual([
      {
        status: "paid",
        scheduledPayments: [
          {
            amortize: 342,
            status: "paid",
            scheduledDate: "",
          },
          {
            amortize: 342,
            status: "paid",
            scheduledDate: "",
          },
          {
            amortize: 342,
            status: "paid",
            scheduledDate: "",
          },
        ],
      },
    ]);
    done();
  });
});
