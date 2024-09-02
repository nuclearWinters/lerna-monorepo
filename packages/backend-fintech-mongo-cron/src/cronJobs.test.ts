import { checkEveryDay, checkEveryMonth } from "./cronJobs";
import { addDays, addMonths } from "date-fns";

describe("cron tests", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  beforeEach(() => {
    jest.clearAllTimers();
  });

  it("test cron job one day", () => {
    const now = new Date();
    const newDate = addDays(new Date(), 1);
    const counter = jest.fn();
    checkEveryDay(() => counter());
    jest.advanceTimersByTime(newDate.getTime() - now.getTime());
    expect(counter).toHaveBeenCalled();
  });

  it("test cron job one month", () => {
    const now = new Date();
    const newDate = addMonths(new Date(), 1);
    const counter = jest.fn();
    checkEveryMonth(() => counter());
    jest.advanceTimersByTime(newDate.getTime() - now.getTime());
    expect(counter).toHaveBeenCalled();
  });
});
