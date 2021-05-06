import { Environment } from "react-relay";
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
        return;
      }
      localStorage.setItem("accessToken", response.signIn.accessToken);
      refetch();
    } /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
