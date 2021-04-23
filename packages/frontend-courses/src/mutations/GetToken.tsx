import { Environment } from "react-relay";
import {
  GetTokenInput,
  GetTokenMutation,
} from "./__generated__/GetTokenMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation GetTokenMutation($input: GetTokenInput!) {
    getToken(input: $input) {
      error
      refreshToken
      accessToken
    }
  }
`;

export const commitFeedbackLikeMutation = (
  environment: Environment,
  input: GetTokenInput
) => {
  return commitMutation<GetTokenMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {} /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
