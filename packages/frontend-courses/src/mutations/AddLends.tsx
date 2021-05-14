import { Environment } from "react-relay";
import {
  AddLendsInput,
  AddLendsMutation,
} from "./__generated__/AddLendsMutation.graphql";

import { commitMutation, graphql } from "react-relay";

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
        raised
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
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const token = root.getLinkedRecord("tokens");
      token?.setValue(data.addLends.validAccessToken, "accessToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};