import React, { FC, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { AddLoan_user$key } from "./__generated__/AddLoan_user.graphql";
import { AddLoanMutation } from "./__generated__/AddLoanMutation.graphql";
import { getDataFromToken, tokensAndData } from "App";
import { Spinner } from "components/Spinner";

const addLoanFragment = graphql`
  fragment AddLoan_user on User {
    id
  }
`;

type Props = {
  user: AddLoan_user$key;
};

export const AddLoan: FC<Props> = (props) => {
  const [commit, isInFlight] = useMutation<AddLoanMutation>(graphql`
    mutation AddLoanMutation($input: AddLoanInput!) {
      addLoan(input: $input) {
        error
        validAccessToken
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
      {isInFlight ? (
        <Spinner />
      ) : (
        <button
          onClick={() => {
            commit({
              variables: {
                input: {
                  goal: form.goal,
                  term: Number(form.term),
                  user_gid: user.id,
                },
              },
              onCompleted: (response) => {
                if (response.addLoan.error) {
                  throw new Error(response.addLoan.error);
                }
              },
              updater: (store, data) => {
                tokensAndData.tokens.accessToken =
                  data.addLoan.validAccessToken;
                const user = getDataFromToken(data.addLoan.validAccessToken);
                tokensAndData.data = user;
              },
              onError: (error) => {
                window.alert(error.message);
              },
            });
          }}
        >
          Enviar solicitud
        </button>
      )}
    </div>
  );
};
