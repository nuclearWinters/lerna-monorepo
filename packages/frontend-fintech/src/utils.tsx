import { LanguageContext } from "./App";
import { resources } from "./i18n";
import { useContext } from "react";

export interface Decode {
  id: string;
  isBorrower: boolean;
  isLender: boolean;
  isSupport: boolean;
  refreshTokenExpireTime: number;
  exp: number;
}

export type Languages = "EN" | "ES";

export const AUTH_API =
  process.env.REALTIME_GATEWAY || "https://localhost:4002/graphql";

export const FINTECH_API =
  process.env.REALTIME_GATEWAY || "https://localhost:4000/graphql";

export const useTranslation = () => {
  const [language, changeLanguage] = useContext(LanguageContext);
  const t = (text: string) => {
    if (language === "ES") {
      return text;
    }
    return resources["EN"].translation[text] || text;
  };
  return { t, changeLanguage };
};

export const getUserDataCache = (): Decode | null => {
  const userData = sessionStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const supportPages = ["/approveLoan", "/settings"];

export const borrowerPages = [
  "/account",
  "/addLoan",
  "/myLoans",
  "/addFunds",
  "/retireFunds",
  "/settings",
  "/myTransactions",
];

export const defaultSupport = "/approveLoan";
export const defaultBorrower = "/myLoans";
export const defaultLender = "/addInvestments";

export const lenderPages = [
  "/account",
  "/addInvestments",
  "/addFunds",
  "/retireFunds",
  "/myInvestments",
  "/myTransactions",
  "/settings",
];

export const monthDiff = (d1: Date, d2: Date) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const dayDiff = (d1: Date, d2: Date) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const getDateFormat = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const getLongDateName = (date: Date, languageEnum: Languages) => {
  const monthName = date.toLocaleString(languageEnum.toLowerCase(), {
    month: "long",
  });
  const year = date.getFullYear();
  const day = date.getDate();
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  const hours12WithZero = hours24 % 12;
  const hours12NoZero = hours12WithZero ? hours12WithZero : 12;
  if (languageEnum === "ES") {
    return `${day} de ${monthName} de ${year} a las ${hours12NoZero}:${minutes} ${ampm}`;
  } else {
    return `${monthName} ${day}[,] ${year} at ${hours12NoZero}:${minutes} ${ampm}`;
  }
};
