import { MongoClient, ObjectId } from "mongodb";
import { UserLogins, UserMongo, UserSessions } from "./types.js";
import { UUID } from "@lerna-monorepo/backend-utilities/types";

MongoClient.connect("mongodb://localhost:27017?directConnection=true", {}).then(
  async (client) => {
    const db = client.db("auth");
    const users = db.collection<UserMongo>("users");
    const logins = db.collection<UserLogins>("logins");
    const sessions = db.collection<UserSessions>("sessions");
    await logins.deleteMany({});
    await users.deleteMany({});
    await sessions.deleteMany({});
    const user_id_one: UUID = "dab40bfd-b4a4-4874-8978-85f518a9aafb";
    const user_id_two: UUID = "9e60e466-70f2-4820-a8f3-604086b62ce2";
    const user_id_three: UUID = "83ae2e46-949a-4a3f-9a9a-9cd09b59fe47";
    await logins.insertOne({
      applicationName: "Lerna Monorepo",
      time: new Date(),
      address: "::1",
      userId: user_id_one,
    });
    await users.insertMany([
      {
        _id: new ObjectId(),
        isBorrower: false,
        isLender: true,
        isSupport: false,
        email: "anrp1@gmail.com",
        password:
          "$2a$12$O4JHSerceMnKfKl1ZB7M6.C9VZ/3osnasNzZmTgk81ursNf0Mc.dW",
        language: "es",
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Pérez",
        RFC: "RFC",
        CURP: "CURP",
        clabe: "clabe",
        mobile: "9831228788",
        id: user_id_one,
      },
      {
        _id: new ObjectId(),
        isBorrower: true,
        isLender: false,
        isSupport: false,
        email: "anrp2@gmail.com",
        password:
          "$2a$12$md7Ch0D94RP7JdBh2xKEueftSx8ACzV6sPlaHPVg26k1vVZ.Ds0v.",
        language: "es",
        name: "Luis Fernando",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Pérez",
        RFC: "RFC",
        CURP: "CURP",
        clabe: "clabe",
        mobile: "9831228788",
        id: user_id_two,
      },
      {
        _id: new ObjectId(),
        isBorrower: false,
        isLender: false,
        isSupport: true,
        email: "anrp3@gmail.com",
        password:
          "$2a$12$5U0Wi/4vg3T/Br1vvLZjN.oCpaVlayx2upJmpdHD8tsVfLRANZeiS",
        language: "es",
        name: "Mariano Alejandro",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Pérez",
        RFC: "RFC",
        CURP: "CURP",
        clabe: "clabe",
        mobile: "9831228788",
        id: user_id_three,
      },
    ]);
    process.exit();
  }
);
