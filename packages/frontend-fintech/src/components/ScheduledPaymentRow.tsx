import React, { FC } from "react";
import { Columns } from "./Colums";
import { Rows } from "./Rows";
import { customRows } from "./Rows.css";
import { Space } from "./Space";
import { customSpace } from "./Space.css";
import { TableColumnName } from "./TableColumnName";
import { customColumn } from "./Column.css";
import {
  baseLoanRowCell,
  baseLoanRowStatus,
  customLoanRowStatusBox,
} from "./LoanRow.css";
import dayjs from "dayjs";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import { useTranslation } from "utils";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import {
  LoanScheduledPaymentStatus,
  ScheduledPaymentRowQuery,
} from "./__generated__/ScheduledPaymentRowQuery.graphql";
import { Languages } from "__generated__/AppUserQuery.graphql";

export const ScheduledPaymentRow: FC<{
  loan_id: string;
  language: Languages;
}> = ({ loan_id, language }) => {
  const { t } = useTranslation();
  const columns = [
    { key: "amortize", title: t("Pago amortización") },
    { key: "status", title: t("Estatus") },
    { key: "scheduledDate", title: t("Fecha de pago") },
  ];
  const data = useLazyLoadQuery<ScheduledPaymentRowQuery>(
    graphql`
      query ScheduledPaymentRowQuery($id: ID!) {
        scheduledPaymentsbyLoanId(id: $id) {
          id
          loan_id
          amortize
          status
          scheduledDate
        }
      }
    `,
    { id: loan_id },
    { fetchPolicy: "store-or-network" }
  );
  const getStatusPayment = (status: LoanScheduledPaymentStatus) => {
    switch (status) {
      case "PAID":
        return t("Pagado");
      case "TO_BE_PAID":
        return t("Por pagar");
      case "DELAYED":
        return t("Atrasado");
      default:
        return "";
    }
  };

  const languageEnum =
    language === "DEFAULT"
      ? navigator.language.includes("es")
        ? "ES"
        : "EN"
      : language === "ES"
        ? "ES"
        : "EN";

  const statuPaymentsColor = (status: LoanScheduledPaymentStatus) => {
    switch (status) {
      case "DELAYED":
        return customLoanRowStatusBox["scheduledPaymentsDelayed"];
      case "PAID":
        return customLoanRowStatusBox["scheduledPaymentsPaid"];
      case "TO_BE_PAID":
        return customLoanRowStatusBox["scheduledPaymentsToBePaid"];
      default:
        return customLoanRowStatusBox["default"];
    }
  };
  return (
    <Rows className={customRows["flex1"]}>
      <Columns>
        <Space className={customSpace["w50"]} />
        {columns.map((column) => (
          <TableColumnName key={column.key}>{column.title}</TableColumnName>
        ))}
      </Columns>
      {data.scheduledPaymentsbyLoanId?.map((payment) => {
        if (!payment) {
          return null;
        }
        return (
          <Columns
            key={String(payment?.scheduledDate)}
            className={customColumn["columnLoanRow"]}
          >
            <Space className={customSpace["w50"]} />
            <div className={baseLoanRowCell}>{payment?.amortize}</div>
            <div className={baseLoanRowStatus}>
              <div className={statuPaymentsColor(payment.status)}>
                {getStatusPayment(payment.status)}
              </div>
            </div>
            <div className={baseLoanRowCell}>
              {dayjs(payment.scheduledDate)
                .locale(languageEnum === "ES" ? es : en)
                .format(
                  languageEnum === "ES"
                    ? "D [de] MMMM [del] YYYY [a las] h:mm a"
                    : "D MMMM[,] YYYY [at] h:mm a"
                )}
            </div>
          </Columns>
        );
      })}
      <Space className={customSpace["h30"]} />
    </Rows>
  );
};
