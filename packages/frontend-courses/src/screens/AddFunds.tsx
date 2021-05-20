import React, { FC, useState } from "react";
import {
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { AddFunds_user$key } from "./__generated__/AddFunds_user.graphql";
import { AddFundsMutation } from "./__generated__/AddFundsMutation.graphql";
import { getRefreshToken } from "App";

const addFundsFragment = graphql`
  fragment AddFunds_user on User {
    id
  }
`;

type Props = {
  user: AddFunds_user$key;
};

export const AddFunds: FC<Props> = (props) => {
  const environment = useRelayEnvironment();
  const [commit] = useMutation<AddFundsMutation>(graphql`
    mutation AddFundsMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
        validAccessToken
        user {
          accountTotal
          accountAvailable
        }
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
    <div>
      <div>Añadir fondos</div>
      <input
        placeholder="Cantidad"
        value={quantity}
        name="quantity"
        onChange={handleQuantityOnChange}
        onBlur={handleQuantityOnBlur}
      />
      <button
        onClick={() => {
          commit({
            variables: {
              input: {
                user_gid: user.id,
                quantity,
                refreshToken: getRefreshToken(environment),
              },
            },
            onCompleted: (response) => {
              if (response.addFunds.error) {
                throw new Error(response.addFunds.error);
              }
            },
            updater: (store, data) => {
              const root = store.getRoot();
              const token = root.getLinkedRecord("tokens");
              token?.setValue(data.addFunds.validAccessToken, "accessToken");
            },
            onError: (error) => {
              window.alert(error.message);
            },
          });
        }}
      >
        Añadir
      </button>
    </div>
  );
};
