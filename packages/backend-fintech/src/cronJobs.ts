import cron, { ScheduledTask } from "node-cron";

export const checkEveryDay = (dayFunction: () => void): ScheduledTask =>
  cron.schedule("0 0 * * *", () => {
    dayFunction();
  });

export const checkEveryMonth = (monthFunction: () => void): ScheduledTask =>
  cron.schedule("0 0 1 * *", () => {
    monthFunction();
  });
