import { tokensAndData } from "App";
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
import { expireSessionTime, logOut, useTranslation } from "utils";
import dayjs from "dayjs";
import { Decode } from "./LogIn";
import { useNavigation } from "yarr";
import decode from "jwt-decode";
import { customSpace } from "components/Space.css";

export const SignUp: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigation();
  const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($input: SignUpInput!) {
      signUp(input: $input) {
        error
        accessToken
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
                        if (response.signUp.error === "jwt expired") {
                          logOut();
                        }
                        return window.alert(response.signUp.error);
                      }
                      tokensAndData.accessToken = response.signUp.accessToken;
                      tokensAndData.exp = dayjs().add(
                        expireSessionTime,
                        "minutes"
                      );
                      tokensAndData.refetchUser();
                      const data = decode<Decode>(response.signUp.accessToken);
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
              <Space className={customSpace["h30"]} />
            </>
          )}
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
