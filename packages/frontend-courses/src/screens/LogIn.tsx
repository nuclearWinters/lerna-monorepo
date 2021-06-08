import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { LogInMutation } from "./__generated__/LogInMutation.graphql";

interface Props {
  refetch: () => void;
}

export const LogIn: FC<Props> = ({ refetch }) => {
  const [commit, isInFlight] = useMutation<LogInMutation>(graphql`
    mutation LogInMutation($input: SignInInput!) {
      signIn(input: $input) {
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
    <div>
      <input placeholder="email" value={email} onChange={handleEmail} />
      <input
        placeholder="password"
        value={password}
        onChange={handlePassword}
      />
      {isInFlight ? (
        <Spinner />
      ) : (
        <button
          onClick={() => {
            commit({
              variables: {
                input: {
                  email,
                  password,
                },
              },
              onCompleted: () => {
                refetch();
              },
              updater: (store, data) => {
                if (data.signIn.error) {
                  throw new Error(data.signIn.error);
                }
                tokensAndData.tokens.accessToken = data.signIn.accessToken;
                tokensAndData.tokens.refreshToken = data.signIn.refreshToken;
                const user = getDataFromToken(data.signIn.accessToken);
                tokensAndData.data = user;
              },
              onError: (error) => {
                window.alert(error.message);
              },
            });
          }}
        >
          Log In
        </button>
      )}
    </div>
  );
};
