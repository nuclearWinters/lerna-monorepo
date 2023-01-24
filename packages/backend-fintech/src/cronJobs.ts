import { CronJob } from "cron";
import { Db } from "mongodb";
import { dayFunction } from "./cronJobDay";
import { monthFunction } from "./cronJobMonth";

export const checkEveryDay = (db: Db): CronJob =>
  new CronJob("0 0 0 * * *", () => {
    dayFunction(db);
  });

export const checkEveryMonth = (db: Db): CronJob =>
  new CronJob("0 0 0 1 * *", () => {
    monthFunction(db);
  });
