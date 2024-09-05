import { useFragment, graphql } from "react-relay/hooks";
import { getLongDateName, useTranslation } from "../../utils";
import { FC } from "react";
import {
  baseMyTransactionsBar,
  baseMyTransactionsBox,
  baseMyTransactionsDate,
  baseMyTransactionsQuantity,
  baseMyTransactionsStatus,
} from "./InvestmentTransaction";
import * as stylex from "@stylexjs/stylex";
import { MoneyTransaction_transaction$key } from "./__generated__/MoneyTransaction_transaction.graphql";
import { TransactionType } from "./__generated__/InvestmentTransaction_transaction.graphql";

interface Props {
  transaction: MoneyTransaction_transaction$key;
}

export const InvestmentTransaction: FC<Props> = ({ transaction }) => {
  const data = useFragment<MoneyTransaction_transaction$key>(
    graphql`
      fragment MoneyTransaction_transaction on MoneyTransaction {
        id
        user_id
        type
        quantity
        created_at
      }
    `,
    transaction
  );

  const { t } = useTranslation();

  const isEs = t("Pago mensual") === "Pago mensual";

  const substraction = data.quantity.includes("-") ? "#CD5C5C" : "#50C878";

  const getStatus = (type: TransactionType) => {
    switch (type) {
      case "COLLECT":
        return t("Pago mensual");
      case "CREDIT":
        return t("Ingreso");
      case "INVEST":
        return t("Inversión");
      case "WITHDRAWAL":
        return t("Retiro");
      default:
        return "";
    }
  };

  const date = new Date(data.created_at);
  const dateFormatted = getLongDateName(date, isEs ? "ES" : "EN");

  return (
    <div {...stylex.props(baseMyTransactionsBox.base)}>
      <div {...stylex.props(baseMyTransactionsBar.base)}>
        <div
          {...stylex.props(
            baseMyTransactionsStatus.base,
            substraction
              ? baseMyTransactionsStatus.substraction
              : baseMyTransactionsStatus.addition
          )}
        >
          {getStatus(data.type)}
        </div>
        <div {...stylex.props(baseMyTransactionsDate.base)}>
          {dateFormatted}
        </div>
      </div>
      <div
        {...stylex.props(
          baseMyTransactionsQuantity.base,
          substraction
            ? baseMyTransactionsQuantity.substraction
            : baseMyTransactionsQuantity.addition
        )}
      >
        {data.quantity}
      </div>
    </div>
  );
};

export default InvestmentTransaction;
