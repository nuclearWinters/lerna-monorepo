import { app } from "./app";
import supertest from "supertest";
import { MongoClient } from "mongodb";

const request = supertest(app);

describe("supertest example with mongodb", () => {
  let client: MongoClient;

  beforeAll(async () => {
    try {
      client = await MongoClient.connect("mongodb://127.0.0.1:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db();
      app.locals.db = db;
    } catch (e) {
      //console.log(e)
    }
  });

  afterAll(async () => {
    try {
      delete app.locals.db;
      await client.close();
    } catch (e) {
      //console.log(e)
    }
  });

  it("should get hola property in json", async (done) => {
    const response = await request
      .post("/graphql")
      .send({
        mutation: "{ users{ id, name} }",
      })
      .set("Accept", "application/json");
    expect(response.body.hola).toBe("Hola esto con hot reload funciona");
    done();
  });
});
