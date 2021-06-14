import { getDataFromToken, tokensAndData } from "App";
import { Checkbox } from "components/Checkbox";
import { Columns } from "components/Colums";
import { CustomButton } from "components/CustomButton";
import { FormSmall } from "components/FormSmall";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { Main } from "components/Main";
import { Space } from "components/Space";
import { Spinner } from "components/Spinner";
import { Title } from "components/Title";
import { WrapperSmall } from "components/WrapperSmall";
import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";
import { useTranslation } from "react-i18next";

interface Props {
  refetch: () => void;
}

export const SignUp: FC<Props> = ({ refetch }) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($input: SignUpInput!) {
      signUp(input: $input) {
        error
        accessToken
        refreshToken
      }
    }
  `);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLender, setIsLender] = useState(true);
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleIsLender = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLender(e.target.name === "lender" ? true : false);
  };
  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Crear cuenta")} />
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
          <Space h={10} />
          <Columns>
            <Checkbox
              name="lender"
              value={isLender}
              onChange={handleIsLender}
              label={t("Prestar") + ":"}
            />
            <Space w={30} />
            <Checkbox
              name="borrower"
              value={!isLender}
              onChange={handleIsLender}
              label={t("Pedir prestado") + ":"}
            />
          </Columns>
          <Space h={30} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <>
              <CustomButton
                text={t("Crear cuenta")}
                onClick={() => {
                  commit({
                    variables: {
                      input: {
                        email,
                        password,
                        isLender,
                        language: navigator.language.includes("es")
                          ? "ES"
                          : "EN",
                      },
                    },
                    onCompleted: (response) => {
                      if (response.signUp.error) {
                        return window.alert(response.signUp.error);
                      }
                      tokensAndData.tokens.accessToken =
                        response.signUp.accessToken;
                      tokensAndData.tokens.refreshToken =
                        response.signUp.refreshToken;
                      const user = getDataFromToken(
                        response.signUp.accessToken
                      );
                      tokensAndData.data = user;
                      refetch();
                    },
                  });
                }}
              />
              <Space h={30} />
            </>
          )}
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
