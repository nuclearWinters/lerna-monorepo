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

export const commitGetTokenMutation = (
  environment: Environment,
  input: GetTokenInput,
  refetch: () => void
) => {
  return commitMutation<GetTokenMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.getToken.error) {
        return;
      }
      localStorage.setItem("accessToken", response.getToken.accessToken);
      localStorage.setItem("refreshToken", response.getToken.refreshToken);
      refetch();
    } /* Mutation completed */,
    onError: (error) => {} /* Mutation errored */,
  });
};
