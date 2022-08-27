import { FormSmall } from "components/FormSmall";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { AccountRow } from "components/AccountRow";
import React, { FC } from "react";
import { graphql } from "relay-runtime";
import { Account_user$key } from "./__generated__/Account_user.graphql";
import { useFragment } from "react-relay";
import { TitleAccount } from "components/TitleAccount";
import { Space } from "components/Space";
import { useTranslation } from "react-i18next";

const accountFragment = graphql`
  fragment Account_user on User {
    accountAvailable
    accountToBePaid
    accountTotal
  }
`;

interface Props {
  user: Account_user$key;
}

export const Account: FC<Props> = (props) => {
  const { t } = useTranslation();
  const user = useFragment(accountFragment, props.user);
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
            color="rgb(58,179,152)"
          />
          <Space h={30} />
        </FormSmall>
        <Space h={30} />
      </WrapperSmall>
    </Main>
  );
};
