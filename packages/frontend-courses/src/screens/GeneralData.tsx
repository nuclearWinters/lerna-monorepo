import React, { FC } from "react";
import { graphql, useFragment } from "react-relay";
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
    password
    accountTotal
    accountAvailable
  }
`;

type Props = {
  user: GeneralData_user$key;
};

export const GeneralData: FC<Props> = (props) => {
  const user = useFragment(generalDataFragment, props.user);
  return (
    <div>
      <div>Datos Generales</div>
      <div>Nombre(s)</div>
      <input placeholder="Nombre(s)" value={user.name} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Apellido paterno</div>
          <input placeholder="Apellido paterno" value={user.apellidoPaterno} />
        </div>
        <div>
          <div>Apellido materno</div>
          <input placeholder="Apellido materno" value={user.apellidoMaterno} />
        </div>
      </div>
      <div>
        <div>RFC</div>
        <input placeholder="RFC" value={user.RFC} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>CURP</div>
          <input placeholder="CURP" value={user.CURP} />
        </div>
        <div>
          <div>Clabe</div>
          <input placeholder="Clabe" value={user.clabe} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Celular</div>
          <input placeholder="Celular" value={user.mobile} />
        </div>
        <div>
          <div>E-mail</div>
          <input placeholder="E-mail" value={user.email} />
        </div>
      </div>
    </div>
  );
};
