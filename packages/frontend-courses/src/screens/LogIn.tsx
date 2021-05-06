import React, { FC, useState } from "react";
import { commitGetTokenMutation } from "mutations/SignIn";
import { RelayEnvironment } from "RelayEnvironment";

interface Props {
  refetch: () => void;
}

export const LogIn: FC<Props> = ({ refetch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return (
    <div>
      <input placeholder="email" value={email} onChange={handleEmail} />
      <input
        placeholder="password"
        value={password}
        onChange={handlePassword}
      />
      <button
        onClick={() => {
          commitGetTokenMutation(
            RelayEnvironment,
            { email, password },
            refetch
          );
        }}
      >
        Log In
      </button>
    </div>
  );
};
