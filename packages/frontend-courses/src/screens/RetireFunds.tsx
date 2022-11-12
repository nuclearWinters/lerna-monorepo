import React, { FC, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { RetireFundsMutation } from "./__generated__/RetireFundsMutation.graphql";
import { tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { FormSmall } from "components/FormSmall";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Space } from "components/Space";
import { logOut, useTranslation } from "utils";
import { customSpace } from "components/Space.css";

export const RetireFunds: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<RetireFundsMutation>(graphql`
    mutation RetireFundsMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const [quantity, setQuantity] = useState("");
  const handleQuantityOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    setQuantity(value);
  };
  const handleQuantityOnBlur = () => {
    setQuantity((state) => {
      if (Number(state) === 0) {
        return "";
      }
      return Number(state).toFixed(2);
    });
  };
  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Retirar fondos")} />
        <FormSmall>
          <Label label={t("Cantidad")} />
          <Input
            placeholder={t("Cantidad")}
            value={quantity}
            name="quantity"
            onChange={handleQuantityOnChange}
            onBlur={handleQuantityOnBlur}
          />
          <Space className={customSpace["h30"]} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text={t("Retirar")}
              onClick={() => {
                commit({
                  variables: {
                    input: {
                      quantity: `-${quantity}`,
                    },
                  },
                  onCompleted: (response) => {
                    if (response.addFunds.error) {
                      if (response.addFunds.error === "jwt expired") {
                        logOut();
                      }
                      return window.alert(response.addFunds.error);
                    }
                    tokensAndData.accessToken =
                      response.addFunds.validAccessToken;
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
