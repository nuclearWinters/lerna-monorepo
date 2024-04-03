import { graphql } from "relay-runtime";

export const settingsFragment = graphql`
  query SettingsQueriesAuthUserQuery {
    authUser {
      id
      name
      apellidoPaterno
      apellidoMaterno
      RFC
      CURP
      clabe
      mobile
      email
      language
      ...SettingsQueries_logins_user
      ...SettingsQueries_sessions_user
    }
  }
`;

export const settingsSessionsPaginationFragment = graphql`
  fragment SettingsQueries_sessions_user on AuthUser
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "SettingsSessionsPaginationUser") {
    sessions(first: $count, after: $cursor)
      @connection(key: "Settings_user_sessions") {
      edges {
        node {
          id
          expirationDate
          ...SessionRow_session
        }
      }
    }
  }
`;

export const settingsLoginsPaginationFragment = graphql`
  fragment SettingsQueries_logins_user on AuthUser
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "SettingsLoginsPaginationUser") {
    logins(first: $count, after: $cursor)
      @connection(key: "Settings_user_logins") {
      edges {
        node {
          id
          ...LoginRow_login
        }
      }
    }
  }
`;
