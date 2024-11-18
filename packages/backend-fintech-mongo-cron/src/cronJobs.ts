import { CronJob } from "cron";

export const checkEveryDay = (cb: () => void) => new CronJob("0 0 0 * * *", cb, null, true, "America/Cancun");

export const checkEveryMonth = (cb: () => void) => new CronJob("0 0 1 * *", cb, null, true, "America/Cancun");
