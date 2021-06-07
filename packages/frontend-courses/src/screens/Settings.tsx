import { tokensAndData } from "App";
import React, { FC } from "react";
import { useMutation, graphql, useFragment } from "react-relay";
import { SettingsBlacklistUserMutation } from "./__generated__/SettingsBlacklistUserMutation.graphql";
import { Settings_user$key } from "./__generated__/Settings_user.graphql";

const settingsFragment = graphql`
  fragment Settings_user on User {
    id
  }
`;

interface Props {
  refetch: () => void;
  user: Settings_user$key;
}

export const Settings: FC<Props> = ({ refetch, user }) => {
  const [commit] = useMutation<SettingsBlacklistUserMutation>(graphql`
    mutation SettingsBlacklistUserMutation($input: BlacklistUserInput!) {
      blacklistUser(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const data = useFragment(settingsFragment, user);
  return (
    <div>
      {data.id !== "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=" && (
        <button
          onClick={() => {
            commit({
              variables: {
                input: {
                  user_gid: data.id,
                },
              },
              onCompleted: (response) => {
                if (response.blacklistUser.error) {
                  throw new Error(response.blacklistUser.error);
                }
                refetch();
              },
              updater: (store, data) => {
                tokensAndData.tokens.accessToken =
                  data.blacklistUser.validAccessToken;
                tokensAndData.tokens.refreshToken =
                  data.blacklistUser.validAccessToken;
              },
              onError: (error) => {
                window.alert(error.message);
              },
            });
          }}
        >
          Bloquear cuenta por 1 hora
        </button>
      )}
    </div>
  );
};
