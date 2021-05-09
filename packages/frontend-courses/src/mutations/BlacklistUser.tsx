import { Environment } from "react-relay";
import {
  BlacklistUserInput,
  BlacklistUserMutation,
} from "./__generated__/BlacklistUserMutation.graphql";

import { commitMutation, graphql } from "react-relay";

const MutationQuery = graphql`
  mutation BlacklistUserMutation($input: BlacklistUserInput!) {
    blacklistUser(input: $input) {
      validAccessToken
      error
    }
  }
`;

export const commitFeedbackLikeMutation = (
  environment: Environment,
  input: BlacklistUserInput
) => {
  return commitMutation<BlacklistUserMutation>(environment, {
    mutation: MutationQuery,
    variables: { input },
    onCompleted: (response) => {},
    onError: (error) => {
      window.alert(error.message);
    },
  });
};
