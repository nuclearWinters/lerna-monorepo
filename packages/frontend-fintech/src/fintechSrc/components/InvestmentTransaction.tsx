import { useFragment, graphql } from "react-relay";
import FaFileContract from "../../assets/file-contract-solid.svg";
import FaUserCircle from "../../assets/circle-user-solid.svg";
import { FC } from "react";
import {
  InvestmentTransaction_transaction$key,
  TransactionType,
} from "./__generated__/InvestmentTransaction_transaction.graphql";
import * as stylex from "@stylexjs/stylex";
import { getLongDateName, useTranslation } from "../../utils";

export const baseMyTransactionsIcon = stylex.create({
  base: {
    height: "18px",
    color: "rgba(255,90,96,0.5)",
    margin: "0px 4px",
    cursor: "pointer",
  },
});

export const baseMyTransactionsBox = stylex.create({
  base: {
    display: "flex",
    flex: "1",
    flexDirection: "row",
    borderBottomColor: "rgb(203,203,203)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
  },
});

export const baseMyTransactionsBar = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "12px 0px",
  },
});

export const baseMyTransactionsStatus = stylex.create({
  base: {
    fontSize: "18px",
  },
  substraction: {
    color: "#CD5C5C",
  },
  addition: {
    color: "#50C878",
  },
});

export const baseMyTransactionsQuantity = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  substraction: {
    color: "#CD5C5C",
  },
  addition: {
    color: "#50C878",
  },
});

export const baseMyTransactionsDescription = stylex.create({
  base: {
    fontSize: "16px",
    padding: "4px 0px",
  },
});

export const baseMyTransactionsDate = stylex.create({
  base: {
    letterSpacing: "1px",
  },
});

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
        <div {...stylex.props(baseMyTransactionsDescription.base)}>
          {t("Prestado a")}{" "}
          <FaUserCircle
            onClick={() => {
              navigator.clipboard.writeText(borrower_id);
            }}
            {...stylex.props(baseMyTransactionsIcon.base)}
          />{" "}
          {t("al fondo")}:{" "}
          <FaFileContract
            onClick={() => {
              navigator.clipboard.writeText(loan_id);
            }}
            {...stylex.props(baseMyTransactionsIcon.base)}
          />
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
