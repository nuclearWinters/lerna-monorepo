import { Environment } from "react-relay";
import {
  SignUpInput,
  SignUpMutation,
} from "./__generated__/SignUpMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      error
      accessToken
      refreshToken
    }
  }
`;

export const commitCreateUserMutation = (
  environment: Environment,
  input: SignUpInput,
  refetch: () => void
) => {
  return commitMutation<SignUpMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.signUp.error) {
        throw new Error(response.signUp.error);
      }
      refetch();
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const tokenLinkedRecord = root.getOrCreateLinkedRecord(
        "tokens",
        "Tokens"
      );
      tokenLinkedRecord.setValue(data.signUp.accessToken, "accessToken");
      tokenLinkedRecord.setValue(data.signUp.refreshToken, "refreshToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
