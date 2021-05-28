import { getDataFromToken, tokensAndData } from "App";
import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { SignUpMutation } from "./__generated__/SignUpMutation.graphql";

interface Props {
  refetch: () => void;
}

export const SignUp: FC<Props> = ({ refetch }) => {
  const [commit] = useMutation<SignUpMutation>(graphql`
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
    <div>
      <input placeholder="email" value={email} onChange={handleEmail} />
      <input
        placeholder="password"
        value={password}
        onChange={handlePassword}
      />
      <button
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
                throw new Error(response.signUp.error);
              }
              refetch();
            },
            updater: (store, data) => {
              tokensAndData.tokens.accessToken = data.signUp.accessToken;
              tokensAndData.tokens.refreshToken = data.signUp.refreshToken;
              const user = getDataFromToken(data.signUp.accessToken);
              tokensAndData.data = user;
            },
            onError: (error) => {
              window.alert(error.message);
            },
          });
        }}
      >
        Sign Up
      </button>
    </div>
  );
};
