import { getDataFromToken, tokensAndData } from "App";
import { CustomButton } from "components/CustomButton";
import { Label } from "components/Label";
import { Spinner } from "components/Spinner";
import React, { CSSProperties, FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";

interface Props {
  refetch: () => void;
}

export const SignUp: FC<Props> = ({ refetch }) => {
  const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($input: SignUpInput!) {
      signUp(input: $input) {
        error
        accessToken
        refreshToken
      }
    }
  `);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return (
    <div style={styles.main}>
      <div style={styles.wrapper}>
        <div style={styles.title}>Crear cuenta</div>
        <form style={styles.form}>
          <Label label="Email" />
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
            style={styles.input}
          />
          <Label label="Email" />
          <input
            name="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            style={styles.input}
          />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text="Crear cuenta"
              style={{ margin: "30px 0px" }}
              onClick={() => {
                commit({
                  variables: {
                    input: {
                      email,
                      password,
                    },
                  },
                  onCompleted: (response) => {
                    if (response.signUp.error) {
                      return window.alert(response.signUp.error);
                    }
                    tokensAndData.tokens.accessToken =
                      response.signUp.accessToken;
                    tokensAndData.tokens.refreshToken =
                      response.signUp.refreshToken;
                    const user = getDataFromToken(response.signUp.accessToken);
                    tokensAndData.data = user;
                    refetch();
                  },
                });
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

const styles: Record<
  "input" | "wrapper" | "main" | "title" | "form",
  CSSProperties
> = {
  input: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
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
};
