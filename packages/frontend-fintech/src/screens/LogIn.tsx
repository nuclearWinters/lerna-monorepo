import { Spinner } from "components/Spinner";
import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay/hooks";
import { LogInMutation } from "./__generated__/LogInMutation.graphql";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { FormSmall } from "components/FormSmall";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Space } from "components/Space";
import { useTranslation } from "utils";
import { useRouteProps } from "yarr";
import { customSpace } from "components/Space.css";
import {
  borrowerPages,
  getUserDataCache,
  lenderPages,
  supportPages,
} from "Routes";

export interface Decode {
  id: string;
  isBorrower: boolean;
  isLender: boolean;
  isSupport: boolean;
  refreshTokenExpireTime: number;
  exp: number;
}

export const LogIn: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<LogInMutation>(graphql`
    mutation LogInMutation($input: SignInInput!) {
      signIn(input: $input) {
        error
      }
    }
  `);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const { search } = useRouteProps();
  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Iniciar sesión")} />
        <FormSmall>
          <Label label={t("Email")} />
          <Input
            type="email"
            name="email"
            placeholder={t("Email")}
            value={email}
            onChange={handleEmail}
          />
          <Label label={t("Password")} />
          <Input
            type="password"
            name="password"
            placeholder={t("Password")}
            value={password}
            onChange={handlePassword}
          />
          <Space className={customSpace["h30"]} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              type="submit"
              text={t("Iniciar sesión")}
              onClick={() => {
                commit({
                  variables: {
                    input: {
                      email,
                      password,
                    },
                  },
                  onCompleted: () => {
                    const redirectTo = search.redirectTo;
                    const redirectPage = `/${redirectTo}`;
                    const userData = getUserDataCache();
                    if (userData) {
                      if (userData.isBorrower) {
                        if (borrowerPages.includes(redirectPage)) {
                          window.location.href = redirectPage;
                        } else {
                          window.location.href = "/myLoans";
                        }
                      } else if (userData.isSupport) {
                        if (supportPages.includes(redirectPage)) {
                          window.location.href = redirectPage;
                        } else {
                          window.location.href = "/approveLoan";
                        }
                      } else {
                        if (lenderPages.includes(redirectPage)) {
                          window.location.href = redirectPage;
                        } else {
                          window.location.href = "/addInvestments";
                        }
                      }
                    }
                  },
                });
              }}
            />
          )}
          <Space className={customSpace["h30"]} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
