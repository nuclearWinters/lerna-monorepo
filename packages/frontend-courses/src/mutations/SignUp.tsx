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
    onCompleted: (response) => {} /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
