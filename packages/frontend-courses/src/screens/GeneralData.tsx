import { tokens } from "App";
import { commitUpdateUserMutation } from "mutations/UpdateUser";
import React, { FC, useRef, useState } from "react";
import { graphql, useFragment } from "react-relay";
import { RelayEnvironment } from "RelayEnvironment";
import { GeneralData_user$key } from "./__generated__/GeneralData_user.graphql";

const generalDataFragment = graphql`
  fragment GeneralData_user on User {
    id
    name
    apellidoPaterno
    apellidoMaterno
    RFC
    CURP
    clabe
    mobile
    email
    accountTotal
    accountAvailable
  }
`;

type Props = {
  user: GeneralData_user$key;
};

export const GeneralData: FC<Props> = (props) => {
  const user = useFragment(generalDataFragment, props.user);
  const [formUser, setFormUser] = useState({
    id: user.id,
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
        <div>
          <div>Email</div>
          <input
            placeholder="Email"
            value={user.email}
            name="email"
            disabled={true}
          />
        </div>
      </div>
      <button
        onClick={() => {
          commitUpdateUserMutation(RelayEnvironment, {
            ...formUser,
            refreshToken: tokens.refreshToken,
          });
        }}
      >
        Update
      </button>
      {isChanged.current && (
        <button
          onClick={() => {
            isChanged.current = false;
            setFormUser({
              id: user.id,
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
