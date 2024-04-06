import { Checkbox } from "../../components/Checkbox";
import { Columns } from "../../components/Colums";
import { CustomButton } from "../../components/CustomButton";
import { FormSmall } from "../../components/FormSmall";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { Main } from "../../components/Main";
import { Space, customSpace } from "../../components/Space";
import { Spinner } from "../../components/Spinner";
import { Title } from "../../components/Title";
import { WrapperSmall } from "../../components/WrapperSmall";
import { ChangeEvent, FC, useState } from "react";
import { useMutation, graphql } from "react-relay/hooks";
import { getUserDataCache, useTranslation } from "../../utils";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";

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
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleIsLender = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLender(e.target.name === "lender" ? true : false);
  };
  return (
    <Main notLogged>
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
          <Space styleX={customSpace.h10} />
          <Columns>
            <Checkbox
              name="lender"
              checked={isLender}
              onChange={handleIsLender}
              label={t("Prestar") + ":"}
            />
            <Space styleX={customSpace.w30} />
            <Checkbox
              name="borrower"
              checked={!isLender}
              onChange={handleIsLender}
              label={t("Pedir prestado") + ":"}
            />
          </Columns>
          <Space styleX={customSpace.h30} />
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
                      const userData = getUserDataCache();
                      if (userData) {
                        if (userData.isBorrower) {
                          window.location.href = "/myLoans";
                        } else if (userData.isSupport) {
                          window.location.href = "/approveLoan";
                        } else {
                          window.location.href = "/addInvestments";
                        }
                      }
                    },
                  });
                }}
              />
              <Space styleX={customSpace.h30} />
            </>
          )}
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default SignUp;
