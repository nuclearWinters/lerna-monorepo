import { Environment } from "react-relay";
import {
  AddLoanInput,
  AddLoanMutation,
} from "./__generated__/AddLoanMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation AddLoanMutation($input: AddLoanInput!) {
    addLoan(input: $input) {
      error
      validAccessToken
      loan {
        id
        _id_user
        score
        ROI
        goal
        term
        raised
        expiry
      }
    }
  }
`;

export const commitAddLoanMutation = (
  environment: Environment,
  input: AddLoanInput
) => {
  return commitMutation<AddLoanMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.addLoan.error) {
        throw new Error(response.addLoan.error);
      }
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const token = root.getLinkedRecord("tokens");
      token?.setValue(data.addLoan.validAccessToken, "accessToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
