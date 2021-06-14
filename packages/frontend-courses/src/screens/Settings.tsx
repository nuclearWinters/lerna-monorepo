import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { CSSProperties, FC, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import { Settings_auth_user$key } from "./__generated__/Settings_auth_user.graphql";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { SettingsBlacklistUserMutation } from "./__generated__/SettingsBlacklistUserMutation.graphql";
import { WrapperBig } from "components/WrapperBig";
import { Main } from "components/Main";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Space } from "components/Space";
import { Rows } from "components/Rows";
import { Columns } from "components/Colums";
import { useTranslation } from "react-i18next";
import { Select } from "components/Select";
import { logOut } from "utils";

const settingsFragment = graphql`
  fragment Settings_auth_user on AuthUser {
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
  }
`;

type Props = {
  user: Settings_auth_user$key;
};

export const Settings: FC<Props> = (props) => {
  const { t, i18n } = useTranslation();
  const [commitBlacklist, isInFlightBlacklist] =
    useMutation<SettingsBlacklistUserMutation>(graphql`
      mutation SettingsBlacklistUserMutation($input: BlacklistUserInput!) {
        blacklistUser(input: $input) {
          error
          validAccessToken
        }
      }
    `);
  const [commit, isInFlight] = useMutation<SettingsMutation>(graphql`
    mutation SettingsMutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const user = useFragment(settingsFragment, props.user);
  const originLang =
    user.language === "DEFAULT"
      ? navigator.language.includes("es")
        ? "es"
        : "en"
      : user.language;
  const [formUser, setFormUser] = useState({
    user_gid: user.id,
    name: user.name,
    apellidoMaterno: user.apellidoMaterno,
    apellidoPaterno: user.apellidoPaterno,
    CURP: user.CURP,
    RFC: user.RFC,
    mobile: user.mobile,
    clabe: user.clabe,
    email: user.email,
    language: originLang,
  });
  const handleFormUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    if (!isChanged.current) {
      isChanged.current = true;
    }
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  const isChanged = useRef(false);
  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    if (!isChanged.current) {
      isChanged.current = true;
    }
    i18n.changeLanguage(value);
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  return (
    <Main>
      <WrapperBig style={{ margin: "30px 60px" }}>
        <Title text={t("Datos generales")} />
        <div style={styles.form}>
          <Label label={t("Nombre(s)")} />
          <Input
            placeholder={t("Nombre(s)")}
            value={formUser.name}
            name="name"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows style={styles.flex}>
              <Label label={t("Apellido paterno")} />
              <Input
                placeholder={t("Apellido paterno")}
                value={formUser.apellidoPaterno}
                name="apellidoPaterno"
                onChange={handleFormUser}
              />
            </Rows>
            <Space w={20} />
            <Rows style={styles.flex}>
              <Label label={t("Apellido materno")} />
              <Input
                placeholder={t("Apellido materno")}
                value={formUser.apellidoMaterno}
                name="apellidoMaterno"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Label label={t("RFC")} />
          <Input
            placeholder={t("RFC")}
            value={formUser.RFC}
            name="RFC"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows style={styles.flex}>
              <Label label={t("CURP")} />
              <Input
                placeholder={t("CURP")}
                value={formUser.CURP}
                name="CURP"
                onChange={handleFormUser}
              />
            </Rows>
            <Space w={20} />
            <Rows style={styles.flex}>
              <Label label={t("Clabe")} />
              <Input
                placeholder={t("Clabe")}
                value={formUser.clabe}
                name="clabe"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Columns>
            <Rows style={styles.flex}>
              <Label label={t("Celular")} />
              <Input
                placeholder={t("Celular")}
                value={formUser.mobile}
                name="mobile"
                onChange={handleFormUser}
              />
            </Rows>
            <Space w={20} />
            <Rows style={styles.flex}>
              <Label label={t("Email")} />
              <Input
                placeholder={t("Email")}
                value={formUser.email}
                name="email"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Space h={30} />
          <Select
            value={formUser.language}
            name="language"
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
            onChange={handleSelectUser}
          />
          <Space h={30} />
          <Columns style={{ justifyContent: "center" }}>
            {isInFlight ? (
              <Spinner />
            ) : (
              <CustomButton
                text={t("Refrescar")}
                onClick={() => {
                  commit({
                    variables: {
                      input: {
                        ...formUser,
                        language: formUser.language === "es" ? "ES" : "EN",
                      },
                    },
                    onCompleted: (response) => {
                      if (response.updateUser.error) {
                        if (response.updateUser.error === "jwt expired") {
                          logOut();
                        }
                        return window.alert(response.updateUser.error);
                      }
                      tokensAndData.tokens.accessToken =
                        response.updateUser.validAccessToken;
                      const user = getDataFromToken(
                        response.updateUser.validAccessToken
                      );
                      tokensAndData.data = user;
                    },
                  });
                }}
              />
            )}
            <Space w={30} />
            {isChanged.current && (
              <CustomButton
                text={t("Restaurar")}
                color="secondary"
                onClick={() => {
                  i18n.changeLanguage(originLang);
                  isChanged.current = false;
                  setFormUser({
                    user_gid: user.id,
                    name: user.name,
                    apellidoMaterno: user.apellidoMaterno,
                    apellidoPaterno: user.apellidoPaterno,
                    CURP: user.CURP,
                    RFC: user.RFC,
                    mobile: user.mobile,
                    clabe: user.clabe,
                    email: user.email,
                    language: originLang,
                  });
                }}
              />
            )}
            <Space w={30} />
            {user.id !== "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=" &&
              (isInFlightBlacklist ? (
                <Spinner />
              ) : (
                <CustomButton
                  text={t("Bloquear cuenta")}
                  color="warning"
                  onClick={() => {
                    commitBlacklist({
                      variables: {
                        input: {
                          user_gid: user.id,
                        },
                      },
                      onCompleted: (response) => {
                        if (response.blacklistUser.error) {
                          if (response.blacklistUser.error === "jwt expired") {
                            logOut();
                          }
                          return window.alert(response.blacklistUser.error);
                        }
                        tokensAndData.tokens.accessToken =
                          response.blacklistUser.validAccessToken;
                        tokensAndData.tokens.refreshToken =
                          response.blacklistUser.validAccessToken;
                        tokensAndData.refetchUser(["FINANCING"], "", null);
                      },
                    });
                  }}
                />
              ))}
          </Columns>
          <Space h={30} />
        </div>
      </WrapperBig>
    </Main>
  );
};

const styles: Record<"form" | "flex", CSSProperties> = {
  form: {
    flex: 1,
    display: "flex",
    alignSelf: "center",
    width: "70%",
    flexDirection: "column",
  },
  flex: {
    flex: 1,
  },
};
