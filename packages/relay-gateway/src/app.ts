import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://0.0.0.0:8000",
    credentials: true,
  })
);

app.use(cookieParser());

export { app };
