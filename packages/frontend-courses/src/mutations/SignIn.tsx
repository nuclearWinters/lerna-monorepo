/*import { Environment } from "react-relay";
import {
  SignInInput,
  SignInMutation,
} from "./__generated__/SignInMutation.graphql";

import { commitMutation, graphql } from "react-relay";

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
      refetch();
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const tokenLinkedRecord = root.getOrCreateLinkedRecord(
        "tokens",
        "Tokens"
      );
      tokenLinkedRecord.setValue(data.signIn.accessToken, "accessToken");
      tokenLinkedRecord.setValue(data.signIn.refreshToken, "refreshToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};*/
