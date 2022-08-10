import { FormSmall } from "components/FormSmall";
import { Main } from "components/Main";
import { WrapperSmall } from "components/WrapperSmall";
import { AccountRow } from "components/AccountRow";
import React, { FC } from "react";
import { graphql } from "relay-runtime";
import { Account_user$key } from "./__generated__/Account_user.graphql";
import { useFragment } from "react-relay";
import { generateCents } from "utils";
import { IUserInvestments } from "Routes";
import { TitleAccount } from "components/TitleAccount";
import { generateCurrency } from "utils";
import { Space } from "components/Space";
import { useTranslation } from "react-i18next";

const accountFragment = graphql`
  fragment Account_user on User {
    investmentsUser {
      _id_loan
      quantity
      term
      ROI
      payments
    }
    accountAvailable
  }
`;

interface Props {
  user: Account_user$key;
}

export const Account: FC<Props> = (props) => {
  const { t } = useTranslation();
  const user = useFragment(accountFragment, props.user);
  const reducedInvestments = user.investmentsUser.reduce<IUserInvestments[]>(
    (acc, item) => {
      const index = acc.findIndex((acc) => acc._id_loan === item._id_loan);
      if (index === -1) {
        acc.push({ ...item, quantity: item.quantity });
      } else {
        acc[index].quantity += item.quantity;
      }
      return acc;
    },
    []
  );
  const accountLends = reducedInvestments.reduce((acc, { quantity }) => {
    return acc + quantity;
  }, 0);
  const accountInterests = reducedInvestments.reduce(
    (acc, { term, ROI, quantity, payments }) => {
      const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
      const owes =
        Math.floor(quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)) *
        (term - payments);
      return acc + owes;
    },
    0
  );
  const accountTotal = generateCents(user.accountAvailable);
  return (
    <Main>
      <WrapperSmall>
        <TitleAccount
          text={t("Valor de la cuenta")}
          value={generateCurrency(accountTotal)}
        />
        <FormSmall>
          <AccountRow
            text={t("Prestado")}
            value={generateCurrency(accountLends)}
          />
          <AccountRow
            text={t("Estimado de los intereses")}
            value={generateCurrency(accountInterests - accountLends)}
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
