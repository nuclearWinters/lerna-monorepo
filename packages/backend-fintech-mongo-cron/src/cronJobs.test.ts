import { addDays, addMonths } from "date-fns";
import { checkEveryDay, checkEveryMonth } from "./cronJobs.ts";
import { describe, it, mock } from "node:test";
import { strictEqual } from "node:assert";

describe("cron tests", () => {
  it("test cron job one day", (context) => {
    context.mock.timers.enable({ apis: ["Date", "setTimeout"], now: new Date("2020-01-01") });
    const now = new Date();
    const newDate = addDays(new Date(), 1);
    const counter = mock.fn();
    checkEveryDay(() => {
      counter();
    });
    context.mock.timers.tick(newDate.getTime() - now.getTime());
    strictEqual(counter.mock.callCount(), 1);
  });

  it("test cron job one month", (context) => {
    context.mock.timers.enable({ apis: ["Date", "setTimeout"], now: new Date("2020-01-01") });
    const now = new Date();
    const newDate = addMonths(new Date(), 1);
    const counter = mock.fn();
    checkEveryMonth(() => {
      counter();
    });
    context.mock.timers.tick(newDate.getTime() - now.getTime());
    strictEqual(counter.mock.callCount(), 1);
  });
});
