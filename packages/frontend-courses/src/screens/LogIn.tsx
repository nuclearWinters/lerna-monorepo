import { getDataFromToken, tokensAndData } from "App";
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
import { LoanStatus } from "__generated__/AppQuery.graphql";

interface Props {
  refetchUser: (
    status: LoanStatus[],
    id: string,
    borrower_id?: string | null
  ) => void;
}

export const LogIn: FC<Props> = ({ refetchUser }) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<LogInMutation>(graphql`
    mutation LogInMutation($input: SignInInput!) {
      signIn(input: $input) {
        error
        accessToken
        refreshToken
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
                      return window.alert(response.signIn.error);
                    }
                    tokensAndData.tokens.accessToken =
                      response.signIn.accessToken;
                    tokensAndData.tokens.refreshToken =
                      response.signIn.refreshToken;
                    const user = getDataFromToken(response.signIn.accessToken);
                    tokensAndData.data = user;
                    refetchUser(
                      user.isBorrower
                        ? ["FINANCING", "TO_BE_PAID", "WAITING_FOR_APPROVAL"]
                        : user.isSupport
                        ? ["WAITING_FOR_APPROVAL"]
                        : ["FINANCING"],
                      user._id,
                      user.isBorrower ? user._id : null
                    );
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
