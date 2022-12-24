import { Spinner } from "components/Spinner";
import React, { FC, useRef, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
} from "react-relay/hooks";
import { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import { SettingsAuthUserQuery } from "./__generated__/SettingsAuthUserQuery.graphql";
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
import { Select } from "components/Select";
import { useTranslation } from "utils";
import { customColumn } from "components/Column.css";
import { customRows } from "components/Rows.css";
import { customSpace } from "components/Space.css";
import { customWrapperBig } from "components/WrapperBig.css";
import { baseSettingsForm } from "./Settings.css";

const settingsFragment = graphql`
  query SettingsAuthUserQuery {
    authUser {
      id
      accountId
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
  }
`;

type Props = {
  preloaded: {
    query: PreloadedQuery<SettingsAuthUserQuery, {}>;
  };
};

export const Settings: FC<Props> = (props) => {
  const { t, changeLanguage } = useTranslation();
  const [commitBlacklist, isInFlightBlacklist] =
    useMutation<SettingsBlacklistUserMutation>(graphql`
      mutation SettingsBlacklistUserMutation($input: BlacklistUserInput!) {
        blacklistUser(input: $input) {
          error
        }
      }
    `);
  const [commit, isInFlight] = useMutation<SettingsMutation>(graphql`
    mutation SettingsMutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        error
      }
    }
  `);
  const { authUser: user } = usePreloadedQuery(
    settingsFragment,
    props.preloaded.query
  );
  const originLang =
    user.language === "DEFAULT"
      ? navigator.language.includes("es")
        ? "ES"
        : "EN"
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
    const value = e.target.value as "EN" | "ES";
    const name = e.target.name;
    if (!isChanged.current) {
      isChanged.current = true;
    }
    changeLanguage(value);
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  return (
    <Main>
      <WrapperBig className={customWrapperBig["settings"]}>
        <Title text={t("Datos generales")} />
        <div className={baseSettingsForm}>
          <Label label={t("Nombre(s)")} />
          <Input
            placeholder={t("Nombre(s)")}
            value={formUser.name}
            name="name"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows className={customRows["flex1"]}>
              <Label label={t("Apellido paterno")} />
              <Input
                placeholder={t("Apellido paterno")}
                value={formUser.apellidoPaterno}
                name="apellidoPaterno"
                onChange={handleFormUser}
              />
            </Rows>
            <Space className={customSpace["w20"]} />
            <Rows className={customRows["flex1"]}>
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
            <Rows className={customRows["flex1"]}>
              <Label label={t("CURP")} />
              <Input
                placeholder={t("CURP")}
                value={formUser.CURP}
                name="CURP"
                onChange={handleFormUser}
              />
            </Rows>
            <Space className={customSpace["w20"]} />
            <Rows className={customRows["flex1"]}>
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
            <Rows className={customRows["flex1"]}>
              <Label label={t("Celular")} />
              <Input
                placeholder={t("Celular")}
                value={formUser.mobile}
                name="mobile"
                onChange={handleFormUser}
              />
            </Rows>
            <Space className={customSpace["w20"]} />
            <Rows className={customRows["flex1"]}>
              <Label label={t("Email")} />
              <Input
                placeholder={t("Email")}
                value={formUser.email}
                name="email"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Space className={customSpace["h30"]} />
          <Select
            value={formUser.language}
            name="language"
            options={[
              { value: "EN", label: "English" },
              { value: "ES", label: "Español" },
            ]}
            onChange={handleSelectUser}
          />
          <Space className={customSpace["h30"]} />
          <Columns className={customColumn["columnJustifyCenter"]}>
            {isInFlight ? (
              <Spinner />
            ) : (
              <CustomButton
                text={t("Actualizar")}
                onClick={() => {
                  commit({
                    variables: {
                      input: {
                        ...formUser,
                        language: formUser.language,
                      },
                    },
                  });
                }}
              />
            )}
            <Space className={customSpace["w30"]} />
            {isChanged.current && (
              <CustomButton
                text={t("Restaurar")}
                color="secondary"
                onClick={() => {
                  changeLanguage(originLang);
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
            <Space className={customSpace["w30"]} />
            {user.accountId ? (
              isInFlightBlacklist ? (
                <Spinner />
              ) : (
                <CustomButton
                  text={t("Bloquear cuenta")}
                  color="warning"
                  onClick={() => {
                    commitBlacklist({
                      variables: {
                        input: {},
                      },
                    });
                  }}
                />
              )
            ) : null}
          </Columns>
          <Space className={customSpace["h30"]} />
        </div>
      </WrapperBig>
    </Main>
  );
};
