import { Environment } from "react-relay";
import {
  SignUpInput,
  SignUpMutation,
} from "./__generated__/SignUpMutation.graphql";

import { commitMutation, graphql } from "react-relay";
import { tokens } from "App";

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
      tokens.accessToken = response.signUp.accessToken;
      tokens.refreshToken = response.signUp.refreshToken;
      refetch();
    },
    onError: (error) => {},
  });
};
