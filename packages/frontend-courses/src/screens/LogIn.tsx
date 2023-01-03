import { tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { FC, useEffect, useState } from "react";
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
import decode from "jwt-decode";
import { useNavigation } from "yarr";
import { customSpace } from "components/Space.css";

export interface Decode {
  isBorrower?: boolean;
  isLender?: boolean;
  isSupport?: boolean;
}

export const LogIn: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigation();
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
  useEffect(() => {
    let ref = setTimeout(() => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data.isBorrower) {
          navigate.push("/myLoans");
        } else if (data.isSupport) {
          navigate.push("/approveLoan");
        } else {
          navigate.push("/addInvestments");
        }
      }
    }, 1000);
    return () => {
      clearTimeout(ref);
    };
  }, [navigate]);
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
                    tokensAndData.refetchUser();
                    const data = decode<Decode>(tokensAndData.accessToken);
                    if (data.isBorrower) {
                      navigate.push("/myLoans");
                    } else if (data.isSupport) {
                      navigate.push("/approveLoan");
                    } else {
                      navigate.push("/addInvestments");
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
