import cassandra from "cassandra-driver";

const client = new cassandra.Client({
  contactPoints: ["h1", "h2"],
  localDataCenter: "datacenter1",
  keyspace: "fintech",
});

const populate = async () => {
  /*----- Users -----*/
  await client.execute(
    `CREATE TABLE fintech.users (
      id UUID,
      account_available int,
      account_to_be_paid int,
      account_total int
      PRIMARY KEY (id)
    );`
  );
  /*----- Transactions -----*/
  await client.execute(
    `CREATE TABLE fintech.transactions_by_user (
      id TIMEUUID,
      user_id UUID,
      type text,
      quantity int,
      borrower_id UUID,
      loan_id UUID,
      created_at timestamp,
      PRIMARY KEY (user_id, id)
    ) WITH CLUSTERING ORDER BY (id DESC);`
  );
  /*----- Loans -----*/
  await client.execute(
    `CREATE TABLE fintech.loans_by_status (
      id TIMEUUID,
      user_id UUID,
      score TEXT,
      roi INT,
      goal INT,
      term INT,
      raised INT,
      expiry TIMESTAMP,
      status TEXT,
      pending INT,
      payments_done INT,
      PRIMARY KEY (status, id)
    );`
  );
  await client.execute(
    `CREATE TABLE fintech.loans_by_user (
      id TIMEUUID,
      user_id UUID,
      score TEXT,
      roi INT,
      goal INT,
      term INT,
      raised INT,
      expiry TIMESTAMP,
      status TEXT,
      pending INT,
      payments_done INT,
      payments_delayed INT,
      PRIMARY KEY (user_id, id)
    );`
  );
  /*----- Scheduled Payments -----*/
  await client.execute(
    `CREATE TABLE fintech.scheduled_payments_by_status (
      id UUID,
      loan_id UUID,
      amortize INT,
      status TEXT,
      scheduled_date TIMESTAMP,
      PRIMARY KEY (status, id, scheduled_date)
    ) WITH CLUSTERING ORDER BY (id ASC, scheduled_date ASC);`
  );
  await client.execute(
    `CREATE TABLE fintech.scheduled_payments_by_loan (
      id UUID,
      loan_id UUID,
      amortize INT,
      status TEXT,
      scheduled_date TIMESTAMP,
      PRIMARY KEY (loan_id, id, scheduled_date)
    ) WITH CLUSTERING ORDER BY (id ASC, scheduled_date ASC);`
  );
  /*----- Investments -----*/
  await client.execute(
    `CREATE TABLE fintech.investments_by_status_type (
      id TIMEUUID,
      borrower_id UUID,
      lender_id UUID,
      loan_id UUID,
      quantity INT,
      created TIMESTAMP,
      updated TIMESTAMP,
      status TEXT,
      status_type TEXT,
      roi INT,
      term INT,
      payments INT,
      moratory INT,
      amortize INT,
      interest_to_earn INT,
      paid_already INT,
      to_be_paid INT,
      PRIMARY KEY (status_type, id)
    ) WITH CLUSTERING ORDER BY (id DESC);`
  );
  await client.execute(
    `CREATE TABLE fintech.investments_by_lender (
      id TIMEUUID,
      borrower_id UUID,
      lender_id UUID,
      loan_id UUID,
      quantity INT,
      created TIMESTAMP,
      updated TIMESTAMP,
      status TEXT,
      status_type TEXT,
      roi INT,
      term INT,
      payments INT,
      moratory INT,
      amortize INT,
      interest_to_earn INT,
      paid_already INT,
      to_be_paid INT,
      PRIMARY KEY (lender_id, id)
    ) WITH CLUSTERING ORDER BY (id DESC);`
  );
  await client.execute(
    `CREATE TABLE fintech.investments_by_loan (
      id TIMEUUID,
      borrower_id UUID,
      lender_id UUID,
      loan_id UUID,
      quantity INT,
      created TIMESTAMP,
      updated TIMESTAMP,
      status TEXT,
      status_type TEXT,
      roi INT,
      term INT,
      payments INT,
      moratory INT,
      amortize INT,
      interest_to_earn INT,
      paid_already INT,
      to_be_paid INT,
      PRIMARY KEY (loan_id, id)
    ) WITH CLUSTERING ORDER BY (id DESC);`
  );
};

populate();
