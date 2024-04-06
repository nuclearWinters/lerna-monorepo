import { Spinner } from "../../components/Spinner";
import { ChangeEvent, FC, useState } from "react";
import { useMutation, graphql } from "react-relay/hooks";
import { Label } from "../../components/Label";
import { CustomButton } from "../../components/CustomButton";
import { Main } from "../../components/Main";
import { WrapperSmall } from "../../components/WrapperSmall";
import { FormSmall } from "../../components/FormSmall";
import { Title } from "../../components/Title";
import { Input } from "../../components/Input";
import { Space, customSpace } from "../../components/Space";
import {
  borrowerPages,
  getUserDataCache,
  lenderPages,
  supportPages,
  useTranslation,
} from "../../utils";
import { LogInMutation } from "./__generated__/LogInMutation.graphql";
import { useSearchParams } from "react-router-dom";

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
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  return (
    <Main notLogged>
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
          <Space styleX={customSpace.h30} />
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
                    const userData = getUserDataCache();
                    if (userData) {
                      if (userData.isBorrower) {
                        if (borrowerPages.includes(redirectTo)) {
                          window.location.href = redirectTo;
                        } else {
                          window.location.href = "/myLoans";
                        }
                      } else if (userData.isSupport) {
                        if (supportPages.includes(redirectTo)) {
                          window.location.href = redirectTo;
                        } else {
                          window.location.href = "/approveLoan";
                        }
                      } else {
                        if (lenderPages.includes(redirectTo)) {
                          window.location.href = redirectTo;
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
          <Space styleX={customSpace.h30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default LogIn;
