import { graphql, useMutation } from "react-relay";
import { utilsAuthLogOutMutation } from "./__generated__/utilsAuthLogOutMutation.graphql";

export const useLogout = () => {
  const [commit] = useMutation<utilsAuthLogOutMutation>(graphql`
    mutation utilsAuthLogOutMutation($input: LogOutInput!) {
      logOut(input: $input) {
        error
      }
    }
  `);
  const logout = () => {
    commit({
      variables: {
        input: {},
      },
      onCompleted: () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userData");
        window.location.reload();
      },
    });
  };
  return logout;
};

export const authUserQuery = graphql`
  query utilsAuthQuery @preloadable {
    authUser {
      id
      name
      apellidoPaterno
      apellidoMaterno
      RFC
      CURP
      clabe
      mobile
      isLender
      isBorrower
      isSupport
      language
      email
    }
  }
`;
