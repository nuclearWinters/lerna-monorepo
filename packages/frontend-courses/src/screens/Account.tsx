import { FormSmall } from "components/FormSmall";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { AccountRow } from "components/AccountRow";
import React, { FC } from "react";
import { graphql } from "relay-runtime";
import { AccountUserQuery } from "./__generated__/AccountUserQuery.graphql";
import { PreloadedQuery, usePreloadedQuery } from "react-relay/hooks";
import { TitleAccount } from "components/TitleAccount";
import { Space } from "components/Space";
import { useTranslation } from "utils";
import { baseAccountRowValue } from "components/AccountRow.css";

const accountFragment = graphql`
  query AccountUserQuery {
    user {
      accountAvailable
      accountToBePaid
      accountTotal
    }
  }
`;

type Props = {
  preloaded: {
    query: PreloadedQuery<AccountUserQuery, {}>;
  };
};

export const Account: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(accountFragment, props.preloaded.query);
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
          <AccountRow
            text={t("Disponible")}
            value={user.accountAvailable}
            className={baseAccountRowValue}
          />
          <Space h={30} />
        </FormSmall>
        <Space h={30} />
      </WrapperSmall>
    </Main>
  );
};
