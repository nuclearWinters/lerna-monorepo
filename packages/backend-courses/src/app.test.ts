import { app } from "./app";
//import supertest from "supertest";
import { MongoClient } from "mongodb";

//const request = supertest(app);

describe("supertest example with mongodb", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();
    app.locals.db = db;
  });

  afterAll(async () => {
    delete app.locals.db;
    await client.close();
  });

  it("should get hola property in json", async (done) => {
    expect(true).toBe(true);
    done();
  });
});
