import cassandra from "cassandra-driver";

const client = new cassandra.Client({
  contactPoints: ["h1", "h2"],
  localDataCenter: "datacenter1",
  keyspace: "fintech",
});

const populate = async () => {
  await client.execute(
    `CREATE TABLE fintech.users (
      id UUID,
      account_available int,
      account_to_be_paid int,
      account_total int
      PRIMARY KEY (id)
    );`
  );
  await client.execute(
    `CREATE TABLE fintech.transactions (
      id UUID,
      id_user UUID,
      type int,
      quantity int,
      id_borrower UUID,
      id_loan UUID,
      created timestamp,
      PRIMARY KEY (id)
    );`
  );
};

populate();
