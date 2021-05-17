import React, { FC, useState } from "react";
import { useMutation, graphql } from "react-relay";
import { LogInMutation } from "./__generated__/LogInMutation.graphql";

interface Props {
  refetch: () => void;
}

export const LogIn: FC<Props> = ({ refetch }) => {
  const [commit] = useMutation<LogInMutation>(graphql`
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
              if (response.signIn.error) {
                throw new Error(response.signIn.error);
              }
              refetch();
            },
            updater: (store, data) => {
              const root = store.getRoot();
              const tokenLinkedRecord = root.getOrCreateLinkedRecord(
                "tokens",
                "Tokens"
              );
              tokenLinkedRecord.setValue(
                data.signIn.accessToken,
                "accessToken"
              );
              tokenLinkedRecord.setValue(
                data.signIn.refreshToken,
                "refreshToken"
              );
            },
            onError: (error) => {
              window.alert(error.message);
            },
          });
        }}
      >
        Log In
      </button>
    </div>
  );
};
