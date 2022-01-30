import { MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "./types";

MongoClient.connect("mongodb://localhost:27017", {}).then(async (client) => {
  const db = client.db("auth");
  const users = db.collection<UserMongo>("users");
  await users.deleteMany({});
  await users.insertMany([
    {
      _id: new ObjectId("607bd608ef9719001cf38fd5"),
      isBorrower: false,
      isLender: true,
      isSupport: false,
      email: "anrp1@gmail.com",
      password: "$2a$12$O4JHSerceMnKfKl1ZB7M6.C9VZ/3osnasNzZmTgk81ursNf0Mc.dW",
      language: "es",
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Pérez",
      RFC: "RFC",
      CURP: "CURP",
      clabe: "clabe",
      mobile: "9831228788",
    },
    {
      _id: new ObjectId("6095f055f92be2001a15885b"),
      isBorrower: true,
      isLender: false,
      isSupport: false,
      email: "anrp2@gmail.com",
      password: "$2a$12$md7Ch0D94RP7JdBh2xKEueftSx8ACzV6sPlaHPVg26k1vVZ.Ds0v.",
      language: "es",
      name: "Luis Fernando",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Pérez",
      RFC: "RFC",
      CURP: "CURP",
      clabe: "clabe",
      mobile: "9831228788",
    },
    {
      _id: new ObjectId("6095f172f92be2001a15885c"),
      isBorrower: false,
      isLender: false,
      isSupport: true,
      email: "anrp3@gmail.com",
      password: "$2a$12$5U0Wi/4vg3T/Br1vvLZjN.oCpaVlayx2upJmpdHD8tsVfLRANZeiS",
      language: "es",
      name: "Mariano Alejandro",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Pérez",
      RFC: "RFC",
      CURP: "CURP",
      clabe: "clabe",
      mobile: "9831228788",
    },
  ]);
  process.exit();
});
