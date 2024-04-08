import { FormSmall } from "../../components/FormSmall";
import { Main } from "../../components/Main";
import { WrapperSmall } from "../../components/WrapperSmall";
import { AccountRow } from "../../components/AccountRow";
import { FC } from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import { TitleAccount } from "../../components/TitleAccount";
import { Space, customSpace } from "../../components/Space";
import { authUserQuery, useTranslation } from "../../utils";
import { accountFragment } from "./AccountQueries";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { RedirectContainer } from "../../components/RedirectContainer";
import { AccountQueriesQuery } from "./__generated__/AccountQueriesQuery.graphql";
import { SimpleEntryPointProps } from "@loop-payments/react-router-relay";

type Props = SimpleEntryPointProps<{
  query: AccountQueriesQuery;
  authQuery: utilsQuery;
}>;

export const Account: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(accountFragment, props.queries.query);
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );

  if (!user || !authUser) {
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
        <TitleAccount
          text={t("Valor de la cuenta")}
          value={user.accountTotal}
        />
        <FormSmall>
          <AccountRow
            text={t("Falta por recibir")}
            value={user.accountToBePaid}
          />
          <AccountRow text={t("Retenido")} value={user.accountWithheld} />
          <AccountRow
            text={t("Disponible")}
            value={user.accountAvailable}
            type={"available"}
          />
          <Space styleX={customSpace.h30} />
        </FormSmall>
        <Space styleX={customSpace.h30} />
      </WrapperSmall>
    </Main>
  );
};

export default Account;
