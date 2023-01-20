import { preloadQuery, tokensAndData } from "App";
import React, { FC, useEffect, useRef } from "react";
import { useNavigation } from "yarr";
import { baseApp } from "App.css";
import AppUserQuery, {
  AppUserQuery as AppUserQueryType,
} from "../__generated__/AppUserQuery.graphql";
import { usePreloadedQuery } from "react-relay";

export const Blank: FC = () => {
  const navigate = useNavigation();
  const { user, authUser } = usePreloadedQuery<AppUserQueryType>(
    AppUserQuery,
    preloadQuery
  );
  const flag = useRef(true);
  useEffect(() => {
    if (flag.current) {
      flag.current = false;
      setTimeout(() => {
        if (!user.accountId) {
          navigate.push("/login");
        } else {
          const redirectTo = tokensAndData.redirectTo;
          if (authUser.isBorrower) {
            if (
              redirectTo &&
              [
                "/account",
                "/addLoan",
                "/myLoans",
                "/addFunds",
                "/retireFunds",
                "/settings",
              ].includes(redirectTo)
            ) {
              navigate.push(redirectTo);
            } else {
              navigate.push("/myLoans");
            }
          } else if (authUser.isSupport) {
            if (
              redirectTo &&
              ["/approveLoan", "/settings"].includes(redirectTo)
            ) {
              navigate.push(redirectTo);
            } else {
              navigate.push("/approveLoan");
            }
          } else {
            if (
              redirectTo &&
              [
                "/account",
                "/addInvestments",
                "/addFunds",
                "/retireFunds",
                "/myInvestments",
                "/myTransactions",
                "/settings",
              ].includes(redirectTo)
            ) {
              navigate.push(redirectTo);
            } else {
              navigate.push("/addInvestments");
            }
            tokensAndData.redirectTo = "";
          }
        }
      }, 0);
    }
  }, [navigate, user, authUser]);
  return <div className={baseApp} />;
};
