import { Spinner } from "components/Spinner";
import React, { FC, useRef, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay/hooks";
import { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import { SettingsAuthUserQuery } from "./__generated__/SettingsAuthUserQuery.graphql";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
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
import { SettingsSessionsPaginationUser } from "./__generated__/SettingsSessionsPaginationUser.graphql";
import { SettingsLoginsPaginationUser } from "./__generated__/SettingsLoginsPaginationUser.graphql";
import { Settings_logins_user$key } from "./__generated__/Settings_logins_user.graphql";
import { Settings_sessions_user$key } from "./__generated__/Settings_sessions_user.graphql";
import { Table } from "components/Table";
import { TableColumnName } from "components/TableColumnName";
import { LoginRow } from "components/LoginRow";
import { SessionRow } from "components/SessionRow";

const settingsFragment = graphql`
  query SettingsAuthUserQuery {
    authUser {
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
      ...Settings_logins_user
      ...Settings_sessions_user
    }
  }
`;

const settingsLoginsPaginationFragment = graphql`
  fragment Settings_logins_user on AuthUser
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "SettingsLoginsPaginationUser") {
    logins(first: $count, after: $cursor)
      @connection(key: "Settings_user_logins") {
      edges {
        node {
          id
          ...LoginRow_login
        }
      }
    }
  }
`;

const settingsSessionsPaginationFragment = graphql`
  fragment Settings_sessions_user on AuthUser
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "SettingsSessionsPaginationUser") {
    sessions(first: $count, after: $cursor)
      @connection(key: "Settings_user_sessions") {
      edges {
        node {
          id
          expirationDate
          ...SessionRow_session
        }
      }
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
  const [commit, isInFlight] = useMutation<SettingsMutation>(graphql`
    mutation SettingsMutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        error
        authUser {
          id
          name
          apellidoPaterno
          apellidoMaterno
          RFC
          CURP
          clabe
          mobile
          language
          email
        }
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
  const { data: loginsData, loadNext: loginsLoadNext } = usePaginationFragment<
    SettingsLoginsPaginationUser,
    Settings_logins_user$key
  >(settingsLoginsPaginationFragment, user);
  const { data: sessionsData, loadNext: sessionsLoadNext } =
    usePaginationFragment<
      SettingsSessionsPaginationUser,
      Settings_sessions_user$key
    >(settingsSessionsPaginationFragment, user);
  const columnsSessions = [
    { key: "applicationName", title: t("Aplicacion") },
    { key: "type", title: t("Tipo de dispositivo") },
    { key: "deviceName", title: t("Nombre del dispositivo") },
    { key: "lasTimeAccessed", title: t("Ultima vez accedido") },
    { key: "address", title: t("IP") },
    { key: "delete", title: t("Borrar") },
  ];
  const columnsLogins = [
    { key: "applicationName", title: t("Aplicacion") },
    { key: "time", title: t("Fecha") },
    { key: "address", title: t("IP") },
  ];
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
          </Columns>
          <Space className={customSpace["h30"]} />
        </div>
        <Title text={t("Logins")} />
        <Table color="primary">
          <Rows className={customRows["flex1"]}>
            <Columns>
              {columnsLogins.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
          </Rows>
        </Table>
        {loginsData?.logins?.edges?.map((edge) =>
          edge?.node ? (
            <LoginRow
              key={edge?.node?.id}
              login={edge?.node}
              language={originLang}
            />
          ) : null
        )}
        <CustomButton
          color="secondary"
          text={t("Cargar más")}
          onClick={() => loginsLoadNext(5)}
        />
        <Space className={customSpace["h20"]} />
        <Title text={t("Sessions")} />
        <Table color="secondary">
          <Rows className={customRows["flex1"]}>
            <Columns>
              {columnsSessions.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
          </Rows>
        </Table>
        {sessionsData?.sessions?.edges
          ?.filter((edge) => {
            return edge?.node?.expirationDate > new Date().getTime();
          })
          .map((edge) =>
            edge?.node ? (
              <SessionRow key={edge?.node?.id} session={edge.node} />
            ) : null
          )}
        <CustomButton
          color="secondary"
          text={t("Cargar más")}
          onClick={() => sessionsLoadNext(5)}
        />
        <Space className={customSpace["h20"]} />
      </WrapperBig>
    </Main>
  );
};
