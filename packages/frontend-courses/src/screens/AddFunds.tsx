import React, { CSSProperties, FC, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { AddFunds_user$key } from "./__generated__/AddFunds_user.graphql";
import { AddFundsMutation } from "./__generated__/AddFundsMutation.graphql";
import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";

const addFundsFragment = graphql`
  fragment AddFunds_user on User {
    id
  }
`;

type Props = {
  user: AddFunds_user$key;
};

export const AddFunds: FC<Props> = (props) => {
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
    <div style={styles.main}>
      <div style={styles.wrapper}>
        <div style={styles.title}>Añadir fondos</div>
        <div style={styles.form}>
          <Label label="Cantidad" />
          <input
            placeholder="Cantidad"
            value={quantity}
            name="quantity"
            onChange={handleQuantityOnChange}
            onBlur={handleQuantityOnBlur}
            style={styles.input}
          />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text="Añadir"
              style={{ margin: "30px 0px" }}
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
                      return window.alert(response.addFunds.error);
                    }
                    tokensAndData.tokens.accessToken =
                      response.addFunds.validAccessToken;
                    const user = getDataFromToken(
                      response.addFunds.validAccessToken
                    );
                    tokensAndData.data = user;
                  },
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<
  "wrapper" | "main" | "title" | "input" | "form",
  CSSProperties
> = {
  wrapper: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 0px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    width: 600,
  },
  main: {
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
  form: {
    flex: 1,
    display: "flex",
    alignSelf: "center",
    width: 500,
    flexDirection: "column",
  },
  input: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
};
