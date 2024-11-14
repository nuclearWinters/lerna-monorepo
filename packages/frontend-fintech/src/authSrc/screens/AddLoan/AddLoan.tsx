import { ChangeEvent, useState } from "react";
import { EntryPointComponent, usePreloadedQuery } from "react-relay/hooks";
import { Label } from "../../../components/Label";
import { Main } from "../../../components/Main";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { FormSmall } from "../../../components/FormSmall";
import { Title } from "../../../components/Title";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Space, customSpace } from "../../../components/Space";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { AddLoanButton } from "../../../fintechSrc/components/AddLoanButton";
import { useTranslation } from "../../../utils";
import { OperationType } from "relay-runtime";

export interface Queries {
  [key: string]: OperationType;
  authQuery: utilsAuthQuery;
}

export const AddLoan: EntryPointComponent<
  Queries,
  Record<string, undefined>
> = (props) => {
  const { t } = useTranslation();
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );
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

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isLender || isSupport) {
    return (
      <RedirectContainer
        allowed={["borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

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
          <AddLoanButton goal={form.goal} term={Number(form.term)} />
          <Space styleX={customSpace.h30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default AddLoan;
