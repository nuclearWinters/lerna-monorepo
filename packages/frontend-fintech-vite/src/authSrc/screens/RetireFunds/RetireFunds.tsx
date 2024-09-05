import { ChangeEvent, useState } from "react";
import { EntryPointComponent, usePreloadedQuery } from "react-relay/hooks";
import { Label } from "../../../components/Label";
import { Main } from "../../../components/Main";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { FormSmall } from "../../../components/FormSmall";
import { Title } from "../../../components/Title";
import { Input } from "../../../components/Input";
import { Space, customSpace } from "../../../components/Space";
import { authUserQuery, useTranslation } from "../../utilsAuth";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { RetireFundsButton } from "../../../fintechSrc/components/RetireFundsButton";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

export type Queries = {
  authQuery: utilsAuthQuery;
};

export const RetireFunds: EntryPointComponent<Queries, {}> = (props) => {
  const { t } = useTranslation();
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );
  const [quantity, setQuantity] = useState("");
  const handleQuantityOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
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
    return (
      <RedirectContainer
        allowed={["lender", "borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <Main>
      <WrapperSmall>
        <Title text={t("Retirar fondos")} />
        <FormSmall>
          <Label label={t("Cantidad")} />
          <Input
            placeholder={t("Cantidad")}
            value={quantity}
            name="quantity"
            onChange={handleQuantityOnChange}
            onBlur={handleQuantityOnBlur}
          />
          <Space styleX={customSpace.h30} />
          <RetireFundsButton quantity={quantity} />
          <Space styleX={customSpace.h30} />
        </FormSmall>
      </WrapperSmall>
    </Main>
  );
};

export default RetireFunds;
