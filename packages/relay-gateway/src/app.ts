import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://0.0.0.0:8000",
      "http://localhost:8000",
      "https://amigoprogramador.com",
      "https://www.amigoprogramador.com",
    ],
    exposedHeaders: ["accessToken"],
    credentials: true,
  })
);

export { app };
