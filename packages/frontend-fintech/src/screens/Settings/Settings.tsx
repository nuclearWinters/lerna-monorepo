import * as stylex from "@stylexjs/stylex";
import { Spinner } from "../../components/Spinner";
import { ChangeEvent, FC, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay/hooks";
import { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import { Label } from "../../components/Label";
import { CustomButton } from "../../components/CustomButton";
import { WrapperBig, baseWrapperBig } from "../../components/WrapperBig";
import { Main } from "../../components/Main";
import { Title } from "../../components/Title";
import { Input } from "../../components/Input";
import { Space, customSpace } from "../../components/Space";
import { Rows, baseRows } from "../../components/Rows";
import { Columns, baseColumn } from "../../components/Colums";
import { Select } from "../../components/Select";
import { Languages, useTranslation } from "../../utils";
import { SettingsSessionsPaginationUser } from "./__generated__/SettingsSessionsPaginationUser.graphql";
import { SettingsLoginsPaginationUser } from "./__generated__/SettingsLoginsPaginationUser.graphql";
import { Table } from "../../components/Table";
import { TableColumnName } from "../../components/TableColumnName";
import { LoginRow } from "../../components/LoginRow";
import { SessionRow } from "../../components/SessionRow";
import {
  settingsFragment,
  settingsLoginsPaginationFragment,
  settingsSessionsPaginationFragment,
} from "./SettingsQueries";
import { SettingsQueriesAuthUserQuery } from "./__generated__/SettingsQueriesAuthUserQuery.graphql";
import { SettingsQueries_logins_user$key } from "./__generated__/SettingsQueries_logins_user.graphql";
import { SettingsQueries_sessions_user$key } from "./__generated__/SettingsQueries_sessions_user.graphql";

export const baseSettingsForm = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    alignSelf: "center",
    width: "70%",
    flexDirection: "column",
  },
});

type Props = {
  query: PreloadedQuery<SettingsQueriesAuthUserQuery, {}>;
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
  const { authUser } = usePreloadedQuery(settingsFragment, props.query);
  const originLang = authUser?.language as Languages;
  const [formUser, setFormUser] = useState({
    name: authUser?.name || "",
    apellidoMaterno: authUser?.apellidoMaterno || "",
    apellidoPaterno: authUser?.apellidoPaterno || "",
    CURP: authUser?.CURP || "",
    RFC: authUser?.RFC || "",
    mobile: authUser?.mobile || "",
    clabe: authUser?.clabe || "",
    email: authUser?.email || "",
    language: originLang as Languages,
  });
  const handleFormUser = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  const handleSelectUser = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "EN" | "ES";
    const name = e.target.name;
    changeLanguage(value);
    setFormUser((state) => {
      return { ...state, [name]: value };
    });
  };
  const { data: loginsData, loadNext: loginsLoadNext } = usePaginationFragment<
    SettingsLoginsPaginationUser,
    SettingsQueries_logins_user$key
  >(settingsLoginsPaginationFragment, authUser);
  const { data: sessionsData, loadNext: sessionsLoadNext } =
    usePaginationFragment<
      SettingsSessionsPaginationUser,
      SettingsQueries_sessions_user$key
    >(settingsSessionsPaginationFragment, authUser);
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

  if (!authUser) {
    return null;
  }

  return (
    <Main>
      <WrapperBig styleX={[baseWrapperBig.base, baseWrapperBig.settings]}>
        <Title text={t("Datos generales")} />
        <div {...stylex.props(baseSettingsForm.base)}>
          <Label label={t("Nombre(s)")} />
          <Input
            placeholder={t("Nombre(s)")}
            value={formUser.name}
            name="name"
            onChange={handleFormUser}
          />
          <Columns>
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Apellido paterno")} />
              <Input
                placeholder={t("Apellido paterno")}
                value={formUser.apellidoPaterno}
                name="apellidoPaterno"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
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
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("CURP")} />
              <Input
                placeholder={t("CURP")}
                value={formUser.CURP}
                name="CURP"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
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
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Celular")} />
              <Input
                placeholder={t("Celular")}
                value={formUser.mobile}
                name="mobile"
                onChange={handleFormUser}
              />
            </Rows>
            <Space styleX={customSpace.w20} />
            <Rows styleX={[baseRows.base, baseRows.flex1]}>
              <Label label={t("Email")} />
              <Input
                placeholder={t("Email")}
                value={formUser.email}
                name="email"
                onChange={handleFormUser}
              />
            </Rows>
          </Columns>
          <Space styleX={customSpace.h30} />
          <Select
            value={formUser.language}
            name="language"
            options={[
              { value: "EN", label: "English" },
              { value: "ES", label: "Español" },
            ]}
            onChange={handleSelectUser}
          />
          <Space styleX={customSpace.h30} />
          <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
            {isInFlight ? (
              <Spinner />
            ) : (
              <CustomButton
                text={t("Actualizar")}
                onClick={() => {
                  commit({
                    variables: {
                      input: formUser,
                    },
                  });
                }}
              />
            )}
          </Columns>
          <Space styleX={customSpace.h30} />
        </div>
        <Title text={t("Logins")} />
        <Table color="primary">
          <Rows styleX={[baseRows.base, baseRows.flex1]}>
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
        <Space styleX={customSpace.h20} />
        <Title text={t("Sessions")} />
        <Table color="secondary">
          <Rows styleX={[baseRows.base, baseRows.flex1]}>
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
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

export default Settings;
