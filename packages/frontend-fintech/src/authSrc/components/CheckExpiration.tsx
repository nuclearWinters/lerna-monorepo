import { FC, useEffect } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { Decode, getUserDataCache } from "../../utils";
import { useLogout } from "../utilsAuth";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";

const { setTimeout } = window;

export const CheckExpiration: FC = () => {
  const logout = useLogout();
  const [refreshSession] = useMutation<CheckExpirationMutation>(graphql`
    mutation CheckExpirationMutation($input: ExtendSessionInput!) {
      extendSession(input: $input) {
        error
      }
    }
  `);
  useEffect(() => {
    const userData = getUserDataCache();
    let timerLogoutID: number;
    let timerRefreshID: number;
    const resetTimer = () => {
      clearTimeout(timerLogoutID);
      timerLogoutID = setTimeout(logout, 1000 * 60 * 5);
    };
    if (userData) {
      const { refreshTokenExpireTime } = userData;
      const now = Date.now();
      const expireTime = refreshTokenExpireTime * 1000;
      const refreshSessionTime = expireTime - 30 * 1000;
      const timeoutDelay = refreshSessionTime - now;
      if (now < refreshSessionTime) {
        timerRefreshID = setTimeout(() => {
          refreshSession({
            variables: {
              input: {},
            },
          });
        }, timeoutDelay);
      } else {
        logout();
      }
    }
    const localStorageListener = (event: StorageEvent) => {
      if (event.key === "userData") {
        const newData = event.newValue;
        if (newData) {
          const userData: Decode = JSON.parse(newData);
          if (userData) {
            const { refreshTokenExpireTime } = userData;
            const now = Date.now();
            const expireTime = refreshTokenExpireTime * 1000;
            const refreshSessionTime = expireTime - 30 * 1000;
            const timeoutDelay = refreshSessionTime - now;
            if (now < refreshSessionTime) {
              clearTimeout(timerRefreshID);
              timerRefreshID = setTimeout(() => {
                refreshSession({
                  variables: {
                    input: {},
                  },
                });
              }, timeoutDelay);
            } else {
              logout();
            }
          }
        }
      }
    };
    addEventListener("storage", localStorageListener);
    addEventListener("keydown", resetTimer);
    addEventListener("mousemove", resetTimer);
    addEventListener("mousedown", resetTimer);
    addEventListener("touchstart", resetTimer);
    addEventListener("click", resetTimer);
    return () => {
      clearTimeout(timerLogoutID);
      clearTimeout(timerRefreshID);
      removeEventListener("storage", localStorageListener);
      removeEventListener("keydown", resetTimer);
      removeEventListener("mousemove", resetTimer);
      removeEventListener("mousedown", resetTimer);
      removeEventListener("touchstart", resetTimer);
      removeEventListener("click", resetTimer);
    };
  }, [logout, refreshSession]);
  return null;
};
