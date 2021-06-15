import { getDataFromToken, tokensAndData } from "App";
import { differenceInSeconds } from "date-fns";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { graphql, useFragment, useMutation } from "react-relay";
import { logOut } from "utils";
import { Columns } from "./Colums";
import { CustomButton } from "./CustomButton";
import { Space } from "./Space";
import { Spinner } from "./Spinner";
import { CheckExpirationMutation } from "./__generated__/CheckExpirationMutation.graphql";
import { CheckExpiration_auth_user$key } from "./__generated__/CheckExpiration_auth_user.graphql";

const checkExpirationFragment = graphql`
  fragment CheckExpiration_auth_user on AuthUser {
    isBorrower
    isSupport
  }
`;

interface Props {
  user: CheckExpiration_auth_user$key;
}

export const CheckExpiration: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { isBorrower, isSupport } = useFragment(
    checkExpirationFragment,
    props.user
  );
  const [commit, isInFlight] = useMutation<CheckExpirationMutation>(graphql`
    mutation CheckExpirationMutation($input: SignInInput!) {
      signIn(input: $input) {
        error
        accessToken
        refreshToken
      }
    }
  `);
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const difference = differenceInSeconds(
    new Date(tokensAndData.data.exp * 1000),
    time
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (difference <= 60 && difference > 0) {
      if (!show) {
        setShow(true);
      }
    }
    if (difference <= 0 && show) {
      if (show) {
        setShow(false);
        logOut();
      }
    }
  }, [difference, setShow, show]);
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
            text={t("Extender sesión 1 hora")}
            onClick={() => {
              commit({
                variables: {
                  input: {
                    email: tokensAndData.credentials.email,
                    password: tokensAndData.credentials.password,
                  },
                },
                onCompleted: (response) => {
                  if (response.signIn.error) {
                    if (response.signIn.error === "jwt expired") {
                      logOut();
                    }
                    return window.alert(response.signIn.error);
                  }
                  tokensAndData.tokens.accessToken =
                    response.signIn.accessToken;
                  tokensAndData.tokens.refreshToken =
                    response.signIn.refreshToken;
                  const user = getDataFromToken(response.signIn.refreshToken);
                  tokensAndData.data = user;
                  tokensAndData.refetchUser(
                    isBorrower
                      ? ["FINANCING", "TO_BE_PAID", "WAITING_FOR_APPROVAL"]
                      : isSupport
                      ? ["WAITING_FOR_APPROVAL"]
                      : ["FINANCING"],
                    user._id,
                    isBorrower ? user._id : null
                  );
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
