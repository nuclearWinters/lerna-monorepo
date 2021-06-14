import { tokensAndData } from "App";

export const generateCurrency = (value: number) => {
  const currencyInCents = parseInt(value.toString(), 10);
  return (currencyInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const generateCents = (value: string) => {
  const digits = value.replace("$", "").replace(",", "");
  const number = parseFloat(digits);
  return number * 100;
};

export const logOut = () => {
  tokensAndData.tokens = { accessToken: "", refreshToken: "" };
  tokensAndData.data = {
    _id: "",
    iat: 0,
    exp: 0,
  };
  tokensAndData.credentials = {
    email: "",
    password: "",
  };
  tokensAndData.refetchUser(["FINANCING"], "", null);
};
