import type { FC } from "react";
import { type PreloadedQuery, usePreloadedQuery } from "react-relay/hooks";
import { AccountRow } from "../../../components/AccountRow.tsx";
import { FormSmall } from "../../../components/FormSmall.tsx";
import { Main } from "../../../components/Main.tsx";
import { Space, customSpace } from "../../../components/Space.tsx";
import { TitleAccount } from "../../../components/TitleAccount.tsx";
import { WrapperSmall } from "../../../components/WrapperSmall.tsx";
import { useTranslation } from "../../../utils.tsx";
import { accountFragment } from "./AccountQueries.tsx";
import type { AccountQueriesQuery } from "./__generated__/AccountQueriesQuery.graphql";

interface Props {
  fintechQuery: PreloadedQuery<AccountQueriesQuery>;
}

export const AccountPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(accountFragment, props.fintechQuery);

  if (!user) {
    return null;
  }

  return (
    <Main>
      <WrapperSmall>
        <TitleAccount text={t("Valor de la cuenta")} value={user.accountTotal} />
        <FormSmall>
          <AccountRow text={t("Falta por recibir")} value={user.accountToBePaid} />
          <AccountRow text={t("Retenido")} value={user.accountWithheld} />
          <AccountRow text={t("Disponible")} value={user.accountAvailable} type={"available"} />
          <Space styleX={customSpace.h30} />
        </FormSmall>
        <Space styleX={customSpace.h30} />
      </WrapperSmall>
    </Main>
  );
};
