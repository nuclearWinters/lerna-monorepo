import React, { FC, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { AddFundsMutation } from "./__generated__/AddFundsMutation.graphql";
import { Spinner } from "components/Spinner";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { FormSmall } from "components/FormSmall";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Space } from "components/Space";
import { useTranslation } from "utils";
import { customSpace } from "components/Space.css";

export const AddFunds: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddFundsMutation>(graphql`
    mutation AddFundsMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
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
        <Title text={t("Añadir fondos")} />
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
            <>
              <CustomButton
                text={t("Añadir")}
                onClick={() => {
                  commit({
                    variables: {
                      input: {
                        quantity,
                      },
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
