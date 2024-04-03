import { ChangeEvent, FC, useState } from "react";
import { graphql, useMutation } from "react-relay/hooks";
import { Spinner } from "../../components/Spinner";
import { Label } from "../../components/Label";
import { CustomButton } from "../../components/CustomButton";
import { Main } from "../../components/Main";
import { WrapperSmall } from "../../components/WrapperSmall";
import { FormSmall } from "../../components/FormSmall";
import { Title } from "../../components/Title";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Space, customSpace } from "../../components/Space";
import { useTranslation } from "../../utils";
import { AddLoanMutation } from "./__generated__/AddLoanMutation.graphql";

export const AddLoan: FC = () => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddLoanMutation>(graphql`
    mutation AddLoanMutation($input: AddLoanInput!) {
      addLoan(input: $input) {
        error
      }
    }
  `);
  const [form, setForm] = useState({
    goal: "",
    term: "3",
  });
  const handleGoalOnChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  const handleTermOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
          <Space styleX={customSpace.h30} />
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
                    },
                  },
                });
              }}
            />
          )}
          <Space styleX={customSpace.h30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default AddLoan;
