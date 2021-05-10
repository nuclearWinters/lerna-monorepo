import { Environment } from "react-relay";
import {
  AddFundsInput,
  AddFundsMutation,
} from "./__generated__/AddFundsMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation AddFundsMutation($input: AddFundsInput!) {
    addFunds(input: $input) {
      error
      validAccessToken
      user {
        accountTotal
        accountAvailable
      }
    }
  }
`;

export const commitAddFundsMutation = (
  environment: Environment,
  input: AddFundsInput
) => {
  return commitMutation<AddFundsMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.addFunds.error) {
        throw new Error(response.addFunds.error);
      }
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const token = root.getLinkedRecord("tokens");
      token?.setValue(data.addFunds.validAccessToken, "accessToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
