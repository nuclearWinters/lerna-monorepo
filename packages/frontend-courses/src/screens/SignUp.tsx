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
import { useMutation, graphql } from "react-relay/hooks";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";
import { useTranslation } from "utils";
import { customSpace } from "components/Space.css";

export const SignUp: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($input: SignUpInput!) {
      signUp(input: $input) {
        error
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
          <Space className={customSpace["h10"]} />
          <Columns>
            <Checkbox
              name="lender"
              checked={isLender}
              onChange={handleIsLender}
              label={t("Prestar") + ":"}
            />
            <Space className={customSpace["w30"]} />
            <Checkbox
              name="borrower"
              checked={!isLender}
              onChange={handleIsLender}
              label={t("Pedir prestado") + ":"}
            />
          </Columns>
          <Space className={customSpace["h30"]} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <>
              <CustomButton
                text={t("Crear cuenta")}
                type="submit"
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
                    onCompleted: () => {
                      window.location.reload();
                    },
                  });
                }}
              />
              <Space className={customSpace["h30"]} />
            </>
          )}
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
