import { Environment } from "react-relay";
import {
  UpdateUserInput,
  UpdateUserMutation,
} from "./__generated__/UpdateUserMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      error
      validAccessToken
      user {
        name
        apellidoMaterno
        apellidoPaterno
        RFC
        CURP
        clabe
        mobile
        accountTotal
        accountAvailable
      }
    }
  }
`;

export const commitUpdateUserMutation = (
  environment: Environment,
  input: UpdateUserInput
) => {
  return commitMutation<UpdateUserMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {
      if (response.updateUser.error) {
        throw new Error(response.updateUser.error);
      }
    },
    updater: (store, data) => {
      const root = store.getRoot();
      const token = root.getLinkedRecord("tokens");
      token?.setValue(data.updateUser.validAccessToken, "accessToken");
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });
};