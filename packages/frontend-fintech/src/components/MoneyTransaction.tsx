import { useFragment, graphql } from "react-relay";
import { useTranslation } from "utils";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import dayjs from "dayjs";
import React, { FC } from "react";
import { MoneyTransaction_transaction$key } from "./__generated__/MoneyTransaction_transaction.graphql";
import { TransactionType } from "./__generated__/InvestmentTransaction_transaction.graphql";
import {
  baseMyTransactionsBar,
  baseMyTransactionsBox,
  baseMyTransactionsDate,
  baseMyTransactionsQuantity,
  baseMyTransactionsStatus,
} from "./InvestmentTransaction";
import * as stylex from "@stylexjs/stylex";

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
          {dayjs(data.created_at)
            .locale(isEs ? es : en)
            .format(
              isEs
                ? "D [de] MMMM [del] YYYY [a las] h:mm a"
                : "D MMMM[,] YYYY [at] h:mm a"
            )}
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
