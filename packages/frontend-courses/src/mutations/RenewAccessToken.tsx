import { Environment } from "react-relay";
import {
  RenewAccessTokenInput,
  RenewAccessTokenMutation,
} from "./__generated__/RenewAccessTokenMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation RenewAccessTokenMutation($input: RenewAccessTokenInput!) {
    renewAccessToken(input: $input) {
      refreshToken
    }
  }
`;

export const commitFeedbackLikeMutation = (
  environment: Environment,
  input: RenewAccessTokenInput
) => {
  return commitMutation<RenewAccessTokenMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {} /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
