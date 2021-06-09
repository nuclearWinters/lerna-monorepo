import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import React, { FC, useRef, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { ProfileMutation } from "./__generated__/ProfileMutation.graphql";
import { Profile_user$key } from "./__generated__/Profile_user.graphql";

const generalDataFragment = graphql`
  fragment Profile_user on User {
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
  user: Profile_user$key;
};

export const Profile: FC<Props> = (props) => {
  const [commit, isInFlight] = useMutation<ProfileMutation>(graphql`
    mutation ProfileMutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        error
        validAccessToken
      }
    }
  `);
  const user = useFragment(generalDataFragment, props.user);
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
    <div>
      <div>Datos Generales</div>
      <div>Nombre(s)</div>
      <input
        placeholder="Nombre(s)"
        value={formUser.name}
        name="name"
        onChange={handleFormUser}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Apellido paterno</div>
          <input
            placeholder="Apellido paterno"
            value={formUser.apellidoPaterno}
            name="apellidoPaterno"
            onChange={handleFormUser}
          />
        </div>
        <div>
          <div>Apellido materno</div>
          <input
            placeholder="Apellido materno"
            value={formUser.apellidoMaterno}
            name="apellidoMaterno"
            onChange={handleFormUser}
          />
        </div>
      </div>
      <div>
        <div>RFC</div>
        <input
          placeholder="RFC"
          value={formUser.RFC}
          name="RFC"
          onChange={handleFormUser}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>CURP</div>
          <input
            placeholder="CURP"
            value={formUser.CURP}
            name="CURP"
            onChange={handleFormUser}
          />
        </div>
        <div>
          <div>Clabe</div>
          <input
            placeholder="Clabe"
            value={formUser.clabe}
            name="clabe"
            onChange={handleFormUser}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Celular</div>
          <input
            placeholder="Celular"
            value={formUser.mobile}
            name="mobile"
            onChange={handleFormUser}
          />
        </div>
        {
          <div>
            <div>Email</div>
            <input
              placeholder="Email"
              value={tokensAndData.data.email}
              name="email"
              disabled={true}
            />
          </div>
        }
      </div>
      {isInFlight ? (
        <Spinner />
      ) : (
        <button
          onClick={() => {
            commit({
              variables: {
                input: {
                  ...formUser,
                },
              },
              onCompleted: (response) => {
                if (response.updateUser.error) {
                  throw new Error(response.updateUser.error);
                }
              },
              updater: (store, data) => {
                tokensAndData.tokens.accessToken =
                  data.updateUser.validAccessToken;
                const user = getDataFromToken(data.updateUser.validAccessToken);
                tokensAndData.data = user;
              },
              onError: (error) => {
                window.alert(error.message);
              },
            });
          }}
        >
          Update
        </button>
      )}
      {isChanged.current && (
        <button
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
        >
          Restore
        </button>
      )}
    </div>
  );
};