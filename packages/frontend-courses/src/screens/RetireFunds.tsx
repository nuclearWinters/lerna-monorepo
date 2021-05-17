import React, { FC, useState } from "react";
import {
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { RetireFunds_user$key } from "./__generated__/RetireFunds_user.graphql";
import { RetireFundsMutation } from "./__generated__/RetireFundsMutation.graphql";

const retireFundsFragment = graphql`
  fragment RetireFunds_user on User {
    id
  }
`;

type Props = {
  user: RetireFunds_user$key;
};

export const RetireFunds: FC<Props> = (props) => {
  const environment = useRelayEnvironment();
  const [commit] = useMutation<RetireFundsMutation>(graphql`
    mutation RetireFundsMutation($input: AddFundsInput!) {
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
  const user = useFragment(retireFundsFragment, props.user);
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
      <div>Retirar fondos</div>
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
                quantity: `-${quantity}`,
                refreshToken:
                  (environment.getStore().getSource().get("client:root:tokens")
                    ?.refreshToken as string) || "",
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
