import { useFragment, graphql } from "react-relay";
import {
  baseMyTransactionsBar,
  baseMyTransactionsBox,
  baseMyTransactionsDate,
  baseMyTransactionsDescription,
  baseMyTransactionsIcon,
  customMyTransactionsQuantity,
  customMyTransactionsStatus,
} from "screens/MyTransactions.css";
import { TransactionType } from "__generated__/RoutesTransactionsSubscription.graphql";
import { FaFileContract, FaUserCircle } from "react-icons/fa";
import { useTranslation } from "utils";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import dayjs from "dayjs";
import React, { FC } from "react";
import { InvestmentTransaction_transaction$key } from "./__generated__/InvestmentTransaction_transaction.graphql";

interface Props {
  transaction: InvestmentTransaction_transaction$key;
}

export const InvestmentTransaction: FC<Props> = ({ transaction }) => {
  const data = useFragment<InvestmentTransaction_transaction$key>(
    graphql`
      fragment InvestmentTransaction_transaction on InvestTransaction {
        id
        user_id
        type
        quantity
        created_at
        borrower_id
        loan_id
      }
    `,
    transaction
  );

  const { t } = useTranslation();

  const isEs = t("Pago mensual") === "Pago mensual";

  const { borrower_id, loan_id } = data;
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
    <div className={baseMyTransactionsBox} key={data.id}>
      <div className={baseMyTransactionsBar}>
        <div
          className={
            substraction
              ? customMyTransactionsStatus["substraction"]
              : customMyTransactionsStatus["addition"]
          }
        >
          {getStatus(data.type)}
        </div>
        <div className={baseMyTransactionsDescription}>
          {t("Prestado a")}{" "}
          <FaUserCircle
            onClick={() => {
              navigator.clipboard.writeText(borrower_id);
            }}
            className={baseMyTransactionsIcon}
          />{" "}
          {t("al fondo")}:{" "}
          <FaFileContract
            onClick={() => {
              navigator.clipboard.writeText(loan_id);
            }}
            className={baseMyTransactionsIcon}
          />
        </div>
        <div className={baseMyTransactionsDate}>
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
        className={
          substraction
            ? customMyTransactionsQuantity["substraction"]
            : customMyTransactionsQuantity["addition"]
        }
      >
        {data.quantity}
      </div>
    </div>
  );
};

export default InvestmentTransaction;
