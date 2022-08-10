import { tokensAndData } from "App";
import { addMinutes, differenceInSeconds } from "date-fns";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { graphql, useMutation } from "react-relay";
import { expireSessionTime, logOut } from "utils";
import { Columns } from "./Colums";
import { CustomButton } from "./CustomButton";
import { Space } from "./Space";
import { Spinner } from "./Spinner";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";
import { useIdleTimer } from "react-idle-timer";

export const CheckExpiration: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<CheckExpirationMutation>(graphql`
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
  const show = difference <= 60 && difference > 0;
  const { isIdle } = useIdleTimer({
    timeout: 1000 * 60 * 10,
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
    if (difference < 0 && isIdle()) {
      logOut();
    } else if (
      difference < 100 &&
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
  }, [difference, isIdle, commit, isInFlight]);
  return show ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        backgroundColor: "white",
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid rgb(200,200,200)",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Space h={20} />
      <div style={{ fontSize: 24 }}>{t("La sesión expirara en")}:</div>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>
        {Math.abs(difference) > 60 ? "" : difference} {t("segundos")}
      </div>
      <Space h={20} />
      <Columns>
        <Space w={20} />
        {isInFlight ? (
          <Spinner />
        ) : (
          <CustomButton
            text={t("Extender sesión 15 minutos")}
            onClick={() => {
              commit({
                variables: {
                  input: {},
                },
                onCompleted: () => {
                  tokensAndData.exp = addMinutes(new Date(), expireSessionTime);
                },
              });
            }}
          />
        )}
        <Space w={10} />
        <CustomButton text="Cerrar sesión" onClick={logOut} />
        <Space w={20} />
      </Columns>
      <Space h={20} />
    </div>
  ) : null;
};
