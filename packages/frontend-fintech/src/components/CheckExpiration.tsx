import { FC, useEffect, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { useLogout } from "utils";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";
import { useIdleTimer } from "react-idle-timer";
import { getUserDataCache } from "Routes";

export const CheckExpiration: FC = () => {
  const logout = useLogout();
  const [commit] = useMutation<CheckExpirationMutation>(graphql`
    mutation CheckExpirationMutation($input: ExtendSessionInput!) {
      extendSession(input: $input) {
        error
      }
    }
  `);
  const { isIdle } = useIdleTimer({
    timeout: 1000 * 60 * 5,
  });
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const userData = getUserDataCache();
      const time = Math.floor(new Date().getTime() / 1000);
      const active = !isIdle();
      const difference = userData ? userData.refreshTokenExpireTime - time : 0;
      const refreshSession =
        difference < 30 && difference > 0 && active && userData;
      const logOutFromSession = difference < 0 && !active && userData;
      if (logOutFromSession) {
        clearInterval(interval);
        logout();
      } else if (refreshSession) {
        clearInterval(interval);
        commit({
          variables: {
            input: {},
          },
          onCompleted: () => {
            setCount((state) => state + 1);
          },
        });
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [commit, isIdle, count, logout]);
  return null;
};
