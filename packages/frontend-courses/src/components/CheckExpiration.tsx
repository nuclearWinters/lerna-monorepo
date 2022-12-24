import { tokensAndData } from "App";
import { FC, useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { logOut } from "utils";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";
import { useIdleTimer } from "react-idle-timer";

export const CheckExpiration: FC = () => {
  const [commit] = useMutation<CheckExpirationMutation>(graphql`
    mutation CheckExpirationMutation($input: ExtendSessionInput!) {
      extendSession(input: $input) {
        error
      }
    }
  `);
  const [time, setTime] = useState(Math.floor(new Date().getTime() / 1000));
  const difference = tokensAndData.exp ? tokensAndData.exp - time : 0;
  const { isIdle } = useIdleTimer({
    timeout: 1000 * 60 * 5,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Math.floor(new Date().getTime() / 1000));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const isFetching = useRef(false);
  useEffect(() => {
    if (difference < 0 && isIdle() && tokensAndData.accessToken) {
      logOut();
    } else if (
      difference < 30 &&
      difference > 0 &&
      !isIdle() &&
      !isFetching.current &&
      tokensAndData.accessToken
    ) {
      isFetching.current = true;
      commit({
        variables: {
          input: {},
        },
        onCompleted: () => {
          isFetching.current = false;
        },
      });
    }
  }, [difference, isIdle, commit]);
  return null;
};
