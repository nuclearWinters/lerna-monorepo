import { Environment } from "react-relay";
import {
  AddLendsInput,
  AddLendsMutation,
} from "./__generated__/AddLendsMutation.graphql";

import { commitMutation, graphql } from "react-relay";
import { tokens } from "App";

const MutationQuery = graphql`
  mutation AddLendsMutation($input: AddLendsInput!) {
    addLends(input: $input) {
      error
      validAccessToken
      user {
        accountAvailable
      }
      loans {
        id
        total
      }
    }
  }
`;

export const commitAddLendsMutation = (
  environment: Environment,
  input: AddLendsInput
) => {
  return commitMutation<AddLendsMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.addLends.error) {
        throw new Error(response.addLends.error);
      }
      tokens.accessToken = response.addLends.validAccessToken;
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
