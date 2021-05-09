import { Environment } from "react-relay";
import {
  SignInInput,
  SignInMutation,
} from "./__generated__/SignInMutation.graphql";

import { commitMutation, graphql } from "react-relay";
import { tokens } from "App";

const MutationQuery = graphql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      error
      accessToken
      refreshToken
    }
  }
`;

export const commitGetTokenMutation = (
  environment: Environment,
  input: SignInInput,
  refetch: () => void
) => {
  return commitMutation<SignInMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.signIn.error) {
        throw new Error(response.signIn.error);
      }
      tokens.accessToken = response.signIn.accessToken;
      tokens.refreshToken = response.signIn.refreshToken;
      localStorage.setItem("accessToken", response.signIn.accessToken);
      localStorage.setItem("refreshToken", response.signIn.refreshToken);
      refetch();
    },
    updater: (store, data) => {
      const root = store.getRoot();
      root.setValue(data.signIn.accessToken, "accessToken");
      root.setValue(data.signIn.refreshToken, "refreshToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
