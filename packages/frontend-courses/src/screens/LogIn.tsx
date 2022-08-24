import { tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { LogInMutation } from "./__generated__/LogInMutation.graphql";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { FormSmall } from "components/FormSmall";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Space } from "components/Space";
import { useTranslation } from "react-i18next";
import { expireSessionTime, logOut } from "utils";
import { addMinutes } from "date-fns";

export const LogIn: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<LogInMutation>(graphql`
    mutation LogInMutation($input: SignInInput!) {
      signIn(input: $input) {
        error
        accessToken
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
  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Iniciar sesión")} />
        <FormSmall>
          <Label label={t("Email")} />
          <Input
            name="email"
            placeholder={t("Email")}
            value={email}
            onChange={handleEmail}
          />
          <Label label={t("Password")} />
          <Input
            name="password"
            placeholder={t("Password")}
            value={password}
            onChange={handlePassword}
          />
          <Space h={30} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text={t("Iniciar sesión")}
              onClick={() => {
                commit({
                  variables: {
                    input: {
                      email,
                      password,
                    },
                  },
                  onCompleted: (response) => {
                    if (response.signIn.error) {
                      if (response.signIn.error === "jwt expired") {
                        logOut();
                      }
                      return window.alert(response.signIn.error);
                    }
                    tokensAndData.accessToken = response.signIn.accessToken;
                    tokensAndData.exp = addMinutes(
                      new Date(),
                      expireSessionTime
                    );
                    tokensAndData.refetchUser();
                    tokensAndData.setToken(response.signIn.accessToken);
                  },
                });
              }}
            />
          )}
          <Space h={30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
