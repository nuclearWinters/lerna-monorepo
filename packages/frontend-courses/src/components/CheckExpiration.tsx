import { tokensAndData } from "App";
import { FC, useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { expireSessionTime, logOut } from "utils";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";
import { useIdleTimer } from "react-idle-timer";
import dayjs from "dayjs";

export const CheckExpiration: FC = () => {
  const [commit] = useMutation<CheckExpirationMutation>(graphql`
    mutation CheckExpirationMutation($input: ExtendSessionInput!) {
      extendSession(input: $input) {
        error
      }
    }
  `);
  const [time, setTime] = useState(dayjs());
  const difference = tokensAndData.exp
    ? tokensAndData.exp.diff(time, "seconds")
    : 0;
  const { isIdle } = useIdleTimer({
    timeout: 1000 * 60 * 3,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
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
          tokensAndData.exp = dayjs().add(expireSessionTime, "minutes");
          isFetching.current = false;
        },
      });
    }
  }, [difference, isIdle, commit]);
  return null;
};
