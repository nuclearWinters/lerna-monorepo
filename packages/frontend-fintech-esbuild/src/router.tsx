import { type EnvironmentProviderOptions, type IEnvironmentProvider, type PreloadedEntryPoint, loadEntryPoint } from "react-relay";
import type { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { RelayEnvironmentAuth, RelayEnvironmentFintech } from "./RelayEnvironment";
import { AccountEntryPoint } from "./authSrc/screens/Account/Account.entrypoint";
import { AddFundsEntryPoint } from "./authSrc/screens/AddFunds/AddFunds.entrypoint";
import { AddInvestmentsEntryPoint } from "./authSrc/screens/AddInvestments/AddInvestments.entrypoint";
import { AddLoanEntryPoint } from "./authSrc/screens/AddLoan/AddLoan.entrypoint";
import { ApproveLoanEntryPoint } from "./authSrc/screens/ApproveLoan/ApproveLoan.entrypoint";
import { HeaderAuthEntryPoint } from "./authSrc/screens/HeaderAuth/HeaderAuth.entrypoint";
import { LogInEntryPoint } from "./authSrc/screens/LogIn/LogIn.entrypoint";
import { MyInvestmentsEntryPoint } from "./authSrc/screens/MyInvestments/MyInvestments.entrypoints";
import { MyLoansEntryPoint } from "./authSrc/screens/MyLoans/MyLoans.entrypoint";
import { MyTransactionsEntryPoint } from "./authSrc/screens/MyTransactions/MyTransactions.entrypoint";
import { RetireFundsEntryPoint } from "./authSrc/screens/RetireFunds/RetireFunds.entrypoint";
import { SettingsEntryPoint } from "./authSrc/screens/Settings/Settings.entrypoint";
import { SignUpEntryPoint } from "./authSrc/screens/SignUp/SignUp.entrypoint";
import { Routes } from "./react-router-elements/Routes";
import { Route } from "./react-router-elements/Routes";
import { historyReplace } from "./react-router-elements/utils";
import { type Decode, defaultBorrower, defaultLender, defaultSupport, getUserDataCache } from "./utils";

const allowedPages = {
  borrower: ["/account", "/myTransactions", "/addFunds", "/retireFunds", "/settings", "/myLoans", "/addLoan"],
  lender: ["/account", "/myTransactions", "/addFunds", "/retireFunds", "/settings", "/myInvestments", "/addInvestments"],
  support: ["/approveLoan", "/settings"],
};

const getRedirectPath = (
  path: UserPages,
  data: Decode | null,
): {
  path: "/myLoans" | "/addInvestments" | "/approveLoan" | "/";
  params: string | null;
} | null => {
  if (data) {
    if (
      (allowedPages.borrower.includes(path) && data.isBorrower) ||
      (allowedPages.lender.includes(path) && data.isLender) ||
      (allowedPages.support.includes(path) && data.isSupport)
    ) {
      return null;
    }
    if (data.isBorrower) {
      return { path: defaultBorrower, params: null };
    }
    if (data.isLender) {
      return { path: defaultLender, params: null };
    }
    return { path: defaultSupport, params: null };
  }
  return { path: "/", params: `redirectTo=${path}` };
};

const options: IEnvironmentProvider<EnvironmentProviderOptions> = {
  getEnvironment: (options) => {
    return options?.environment === "auth" ? RelayEnvironmentAuth : RelayEnvironmentFintech;
  },
};

const headerEntryPointReference = loadEntryPoint(options, HeaderAuthEntryPoint, {});

const routesData = {
  "/": LogInEntryPoint,
  "/register": SignUpEntryPoint,
  "/settings": SettingsEntryPoint,
  "/account": AccountEntryPoint,
  "/myTransactions": MyTransactionsEntryPoint,
  "/addFunds": AddFundsEntryPoint,
  "/retireFunds": RetireFundsEntryPoint,
  "/addInvestments": AddInvestmentsEntryPoint,
  "/addLoan": AddLoanEntryPoint,
  "/approveLoan": ApproveLoanEntryPoint,
  "/myLoans": MyLoansEntryPoint,
  "/myInvestments": MyInvestmentsEntryPoint,
};

const referencesMap = new Map<
  RouteKeys,
  {
    entrypoint: null;
    loader: () => UnionReferences;
  }
>();

for (const key in routesData) {
  const typedKey = key as RouteKeys;
  referencesMap.set(typedKey, {
    entrypoint: null,
    loader: () => {
      const reference = loadEntryPoint(options, routesData[typedKey], {});
      references[typedKey].entrypoint = reference;
      return reference;
    },
  });
}

export const references = Object.fromEntries(referencesMap.entries()) as ReferencesType;

const pathname = window.location.pathname;
const data = getUserDataCache();

const sessionPages = ["/", "/register"];

type SessionPages = "/" | "/register";

const isSessionPage = (path: string): path is SessionPages => {
  return sessionPages.includes(path);
};

type UserPages =
  | "/approveLoan"
  | "/settings"
  | "/addInvestments"
  | "/myInvestments"
  | "/addLoan"
  | "/myLoans"
  | "/account"
  | "/myTransactions"
  | "/addFunds"
  | "/retireFunds";

const isUserPage = (path: string): path is UserPages => {
  return [
    "/approveLoan",
    "/settings",
    "/addInvestments",
    "/myInvestments",
    "/addLoan",
    "/myLoans",
    "/account",
    "/myTransactions",
    "/addFunds",
    "/retireFunds",
  ].includes(path);
};

if (isSessionPage(pathname)) {
  if (data?.isBorrower) {
    references[defaultBorrower].loader();
    historyReplace(defaultBorrower);
  }
  if (data?.isSupport) {
    references[defaultSupport].loader();
    historyReplace(defaultSupport);
  }
  if (data?.isLender) {
    references[defaultLender].loader();
    historyReplace(defaultLender);
  } else {
    references[pathname].loader();
  }
} else if (isUserPage(pathname)) {
  const redirectPath = getRedirectPath(pathname, data);
  if (redirectPath) {
    references[redirectPath.path].loader();
    historyReplace(`${redirectPath.path}${redirectPath.params ? `?${redirectPath.params}` : ""}`);
  } else {
    references[pathname].loader();
  }
}

export const MyRouter = () => {
  return (
    <Routes entryPointReference={headerEntryPointReference}>
      {Object.keys(references).map((key) => (
        <Route path={key as RouteKeys} key={key} />
      ))}
    </Routes>
  );
};

export type RoutesDataType = typeof routesData;

export type RouteKeys = keyof typeof routesData;

export type ReferencesType = {
  [Property in keyof RoutesDataType]: {
    entrypoint: EntryPointReference<RoutesDataType[Property]>;
    loader: () => EntryPointReference<RoutesDataType[Property]>;
  };
};

export type EntryPointReference<T> = PreloadedEntryPoint<GetEntryPointComponentFromEntryPoint<T>> | null;

export type UnionReferences = EntryPointReference<RoutesDataType[RouteKeys]>;
