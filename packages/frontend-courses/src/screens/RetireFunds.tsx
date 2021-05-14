import { commitAddFundsMutation } from "mutations/AddFunds";
import React, { FC, useState } from "react";
import { graphql, useFragment, useRelayEnvironment } from "react-relay";
import { RetireFunds_user$key } from "./__generated__/RetireFunds_user.graphql";

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
          commitAddFundsMutation(environment, {
            user_gid: user.id,
            quantity,
            refreshToken:
              (environment.getStore().getSource().get("client:root:tokens")
                ?.refreshToken as string) || "",
          });
        }}
      >
        Añadir
      </button>
    </div>
  );
};
