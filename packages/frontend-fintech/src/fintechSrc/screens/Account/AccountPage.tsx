import { FormSmall } from "../../../components/FormSmall";
import { Main } from "../../../components/Main";
import { WrapperSmall } from "../../../components/WrapperSmall";
import { AccountRow } from "../../../components/AccountRow";
import { FC } from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay/hooks";
import { TitleAccount } from "../../../components/TitleAccount";
import { Space, customSpace } from "../../../components/Space";
import { useTranslation } from "../../../utils";
import { accountFragment } from "./AccountQueries";
import { AccountQueriesQuery } from "./__generated__/AccountQueriesQuery.graphql";

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
