import React, { FC, useState } from "react";
import {
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { AddLoan_user$key } from "./__generated__/AddLoan_user.graphql";
import { AddLoanMutation } from "./__generated__/AddLoanMutation.graphql";
import { getRefreshToken } from "App";

const addLoanFragment = graphql`
  fragment AddLoan_user on User {
    id
  }
`;

type Props = {
  user: AddLoan_user$key;
};

export const AddLoan: FC<Props> = (props) => {
  const environment = useRelayEnvironment();
  const [commit] = useMutation<AddLoanMutation>(graphql`
    mutation AddLoanMutation($input: AddLoanInput!) {
      addLoan(input: $input) {
        error
        validAccessToken
        loan {
          id
          _id_user
          score
          ROI
          goal
          term
          raised
          expiry
        }
      }
    }
  `);
  const user = useFragment(addLoanFragment, props.user);
  const [form, setForm] = useState({
    goal: "",
    term: "3",
  });
  const handleGoalOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    setForm((state) => {
      return { ...state, goal: value };
    });
  };
  const handleGoalOnBlur = () => {
    setForm((state) => {
      if (Number(state.goal) === 0) {
        return { ...state, goal: "" };
      }
      return {
        ...state,
        goal: Number(state.goal).toFixed(2),
      };
    });
  };
  const handleTermOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((state) => {
      return {
        ...state,
        term: value,
      };
    });
  };
  return (
    <div>
      <div>Pedir prestamo</div>
      <input
        placeholder="Cantidad"
        value={form.goal}
        name="goal"
        onChange={handleGoalOnChange}
        onBlur={handleGoalOnBlur}
      />
      <label>
        Periodo de la deuda:
        <select name="term" value={form.term} onChange={handleTermOnChange}>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="12">12</option>
        </select>
        Meses
      </label>
      <button
        onClick={() => {
          commit({
            variables: {
              input: {
                goal: form.goal,
                term: Number(form.term),
                user_gid: user.id,
                refreshToken: getRefreshToken(environment),
              },
            },
            onCompleted: (response) => {
              if (response.addLoan.error) {
                throw new Error(response.addLoan.error);
              }
            },
            updater: (store, data) => {
              const root = store.getRoot();
              const token = root.getLinkedRecord("tokens");
              token?.setValue(data.addLoan.validAccessToken, "accessToken");
            },
            onError: (error) => {
              window.alert(error.message);
            },
          });
        }}
      >
        Enviar solicitud
      </button>
    </div>
  );
};
