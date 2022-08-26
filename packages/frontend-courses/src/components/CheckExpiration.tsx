import { tokensAndData } from "App";
import { addMinutes, differenceInSeconds } from "date-fns";
import { FC, useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { expireSessionTime, logOut } from "utils";
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
  const [time, setTime] = useState(new Date());
  const difference = tokensAndData.exp
    ? differenceInSeconds(tokensAndData.exp, time)
    : 0;
  const { isIdle } = useIdleTimer({
    timeout: 1000 * 60 * 3,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
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
      difference < 100 &&
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
          tokensAndData.exp = addMinutes(new Date(), expireSessionTime);
          isFetching.current = false;
        },
      });
    }
  }, [difference, isIdle, commit]);
  return null;
};
