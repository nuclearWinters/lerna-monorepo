import { type ChangeEvent, useState } from "react";
import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { FormSmall } from "../../../components/FormSmall";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Main } from "../../../components/Main";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { Space, customSpace } from "../../../components/Space";
import { Title } from "../../../components/Title";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { AddFundsButton } from "../../../fintechSrc/components/AddFundsButton";
import { useTranslation } from "../../../utils";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  authQuery: utilsAuthQuery;
}

export const AddFunds: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { t } = useTranslation();
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);
  const [quantity, setQuantity] = useState("");
  const handleQuantityOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number.isNaN(Number(value))) {
      return;
    }
    setQuantity(value);
  };
  const handleQuantityOnBlur = () => {
    setQuantity((state) => {
      if (Number(state) === 0) {
        return "";
      }
      return Number(state).toFixed(2);
    });
  };

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport) {
    return <RedirectContainer allowed={["lender", "borrower"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Añadir fondos")} />
        <FormSmall>
          <Label label={t("Cantidad")} />
          <Input placeholder={t("Cantidad")} value={quantity} name="quantity" onChange={handleQuantityOnChange} onBlur={handleQuantityOnBlur} />
          <Space styleX={customSpace.h30} />
          <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
            <AddFundsButton quantity={quantity} />
          </RelayEnvironmentProvider>
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default AddFunds;
