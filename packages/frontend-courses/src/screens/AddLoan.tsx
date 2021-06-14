import React, { FC, useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { AddLoan_user$key } from "./__generated__/AddLoan_user.graphql";
import { AddLoanMutation } from "./__generated__/AddLoanMutation.graphql";
import { tokensAndData } from "App";
import { Spinner } from "components/Spinner";
import { Label } from "components/Label";
import { CustomButton } from "components/CustomButton";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { FormSmall } from "components/FormSmall";
import { Title } from "components/Title";
import { Input } from "components/Input";
import { Select } from "components/Select";
import { Space } from "components/Space";
import { useTranslation } from "react-i18next";
import { logOut } from "utils";

const addLoanFragment = graphql`
  fragment AddLoan_user on User {
    id
  }
`;

type Props = {
  user: AddLoan_user$key;
};

export const AddLoan: FC<Props> = (props) => {
  const { t } = useTranslation();
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
        goal: Number(state.goal).toFixed(),
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
    <Main>
      <WrapperSmall>
        <Title text={t("Pedir prestamo")} />
        <FormSmall>
          <Label label={t("Cantidad")} />
          <Input
            placeholder={t("Cantidad")}
            value={form.goal}
            name="goal"
            onChange={handleGoalOnChange}
            onBlur={handleGoalOnBlur}
          />
          <Label label={t("Periodo de la deuda (meses)")} />
          <Select
            name="term"
            value={form.term}
            onChange={handleTermOnChange}
            options={[
              {
                value: "3",
                label: "3",
              },
              {
                value: "6",
                label: "6",
              },
              {
                value: "9",
                label: "9",
              },
              {
                value: "12",
                label: "12",
              },
            ]}
          />
          <Space h={30} />
          {isInFlight ? (
            <Spinner />
          ) : (
            <CustomButton
              text={t("Enviar solicitud")}
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
                      if (response.addLoan.error === "jwt expired") {
                        logOut();
                      }
                      return window.alert(response.addLoan.error);
                    }
                    tokensAndData.tokens.accessToken =
                      response.addLoan.validAccessToken;
                  },
                });
              }}
            />
          )}
          <Space h={30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};
