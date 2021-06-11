import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { CSSProperties, FC, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import { Settings_user$key } from "./__generated__/Settings_user.graphql";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { SettingsBlacklistUserMutation } from "./__generated__/SettingsBlacklistUserMutation.graphql";

const settingsFragment = graphql`
  fragment Settings_user on User {
    id
    name
    apellidoPaterno
    apellidoMaterno
    RFC
    CURP
    clabe
    mobile
    investments {
      _id_loan
      quantity
      term
      ROI
      payments
    }
    accountAvailable
  }
`;

type Props = {
  user: Settings_user$key;
  refetch: () => void;
};

export const Settings: FC<Props> = (props) => {
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
  const [formUser, setFormUser] = useState({
    user_gid: user.id,
    name: user.name,
    apellidoMaterno: user.apellidoMaterno,
    apellidoPaterno: user.apellidoPaterno,
    CURP: user.CURP,
    RFC: user.RFC,
    mobile: user.mobile,
    clabe: user.clabe,
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
  return (
    <div style={styles.main}>
      <div style={styles.wrapper}>
        <div style={styles.title}>Datos generales</div>
        <div style={styles.form}>
          <Label label="Nombre(s)" />
          <input
            placeholder="Nombre(s)"
            value={formUser.name}
            name="name"
            onChange={handleFormUser}
            style={styles.input}
          />
          <div style={styles.twoColumns}>
            <div style={styles.columnLeft}>
              <Label label="Apellido paterno" />
              <input
                placeholder="Apellido paterno"
                value={formUser.apellidoPaterno}
                name="apellidoPaterno"
                onChange={handleFormUser}
                style={styles.input}
              />
            </div>
            <div style={styles.columnRight}>
              <Label label="Apellido materno" />
              <input
                placeholder="Apellido materno"
                value={formUser.apellidoMaterno}
                name="apellidoMaterno"
                onChange={handleFormUser}
                style={styles.input}
              />
            </div>
          </div>
          <Label label="RFC" />
          <input
            placeholder="RFC"
            value={formUser.RFC}
            name="RFC"
            onChange={handleFormUser}
            style={styles.input}
          />
          <div style={styles.twoColumns}>
            <div style={styles.columnLeft}>
              <Label label="CURP" />
              <input
                placeholder="CURP"
                value={formUser.CURP}
                name="CURP"
                onChange={handleFormUser}
                style={styles.input}
              />
            </div>
            <div style={styles.columnRight}>
              <Label label="Clabe" />
              <input
                placeholder="Clabe"
                value={formUser.clabe}
                name="clabe"
                onChange={handleFormUser}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.columnLeft}>
              <Label label="Celular" />
              <input
                placeholder="Celular"
                value={formUser.mobile}
                name="mobile"
                onChange={handleFormUser}
                style={styles.input}
              />
            </div>
            <div style={styles.columnRight}>
              <Label label="Email" />
              <input
                placeholder="Email"
                value={tokensAndData.data.email}
                name="email"
                style={styles.input}
                disabled={true}
              />
            </div>
          </div>
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text="Actualizar"
              style={{ backgroundColor: "#1bbc9b", marginTop: 30 }}
              onClick={() => {
                commit({
                  variables: {
                    input: {
                      ...formUser,
                    },
                  },
                  onCompleted: (response) => {
                    if (response.updateUser.error) {
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
          {isChanged.current && (
            <CustomButton
              text="Restaurar"
              style={{ margin: "30px 0px" }}
              onClick={() => {
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
                });
              }}
            />
          )}
          {user.id !== "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=" &&
            (isInFlightBlacklist ? (
              <Spinner />
            ) : (
              <CustomButton
                text="Bloquear cuenta"
                style={{
                  margin: "30px 0px",
                  backgroundColor: "rgb(130,130,130)",
                }}
                onClick={() => {
                  commitBlacklist({
                    variables: {
                      input: {
                        user_gid: user.id,
                      },
                    },
                    onCompleted: (response) => {
                      if (response.blacklistUser.error) {
                        return window.alert(response.blacklistUser.error);
                      }
                      tokensAndData.tokens.accessToken =
                        response.blacklistUser.validAccessToken;
                      tokensAndData.tokens.refreshToken =
                        response.blacklistUser.validAccessToken;
                      props.refetch();
                    },
                  });
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<
  | "input"
  | "wrapper"
  | "main"
  | "title"
  | "form"
  | "twoColumns"
  | "columnRight"
  | "columnLeft",
  CSSProperties
> = {
  input: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
  wrapper: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 60px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
    display: "flex",
  },
  title: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
  form: {
    flex: 1,
    display: "flex",
    alignSelf: "center",
    width: "70%",
    flexDirection: "column",
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginLeft: 10,
  },
  columnLeft: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginRight: 10,
  },
};
