import React, { FC, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { AddFunds_user$key } from "./__generated__/AddFunds_user.graphql";
import { AddFundsMutation } from "./__generated__/AddFundsMutation.graphql";
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
import { useTranslation } from "react-i18next";
import { logOut } from "utils";

const addFundsFragment = graphql`
  fragment AddFunds_user on User {
    id
  }
`;

type Props = {
  user: AddFunds_user$key;
};

export const AddFunds: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddFundsMutation>(graphql`
    mutation AddFundsMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const user = useFragment(addFundsFragment, props.user);
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
          <Space h={30} />
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
                        user_gid: user.id,
                        quantity,
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

              <Space h={30} />
            </>
          )}
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
