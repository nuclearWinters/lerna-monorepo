import React, { FC, useState } from "react";
import { commitCreateUserMutation } from "mutations/SignUp";
import { useRelayEnvironment } from "react-relay";

interface Props {
  refetch: () => void;
}

export const SignUp: FC<Props> = ({ refetch }) => {
  const environment = useRelayEnvironment();
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
          commitCreateUserMutation(environment, { email, password }, refetch);
        }}
      >
        Sign Up
      </button>
    </div>
  );
};
