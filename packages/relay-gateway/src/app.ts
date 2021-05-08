import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://0.0.0.0:8000",
  })
);

export { app };
