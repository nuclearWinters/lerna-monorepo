import { Environment } from "react-relay";
import {
  CreateUserInput,
  CreateUserMutation,
} from "./__generated__/CreateUserMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      error
      refreshToken
      accessToken
    }
  }
`;

export const commitFeedbackLikeMutation = (
  environment: Environment,
  input: CreateUserInput
) => {
  return commitMutation<CreateUserMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {} /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
