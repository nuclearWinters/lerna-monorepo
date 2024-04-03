import { FC } from "react";
import { Columns, baseColumn } from "./Colums";
import { Rows, baseRows } from "./Rows";
import { Space, customSpace } from "./Space";
import { TableColumnName } from "./TableColumnName";
import dayjs from "dayjs";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import { useTranslation } from "../utils";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import {
  LoanScheduledPaymentStatus,
  ScheduledPaymentRowQuery,
} from "./__generated__/ScheduledPaymentRowQuery.graphql";
import { Languages } from "../__generated__/AppUserQuery.graphql";
import {
  baseLoanRowCell,
  baseLoanRowStatus,
  baseLoanRowStatusBox,
} from "./LoanRow";
import * as stylex from "@stylexjs/stylex";

export const ScheduledPaymentRow: FC<{
  loan_gid: string;
  language: Languages;
}> = ({ loan_gid, language }) => {
  const { t } = useTranslation();
  const columns = [
    { key: "amortize", title: t("Pago amortización") },
    { key: "status", title: t("Estatus") },
    { key: "scheduledDate", title: t("Fecha de pago") },
  ];
  const data = useLazyLoadQuery<ScheduledPaymentRowQuery>(
    graphql`
      query ScheduledPaymentRowQuery($loan_gid: ID!) {
        scheduledPaymentsbyLoanId(loan_gid: $loan_gid) {
          id
          loan_id
          amortize
          status
          scheduledDate
        }
      }
    `,
    { loan_gid },
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
        return baseLoanRowStatusBox.scheduledPaymentsDelayed;
      case "PAID":
        return baseLoanRowStatusBox.scheduledPaymentsPaid;
      case "TO_BE_PAID":
        return baseLoanRowStatusBox.scheduledPaymentsToBePaid;
      default:
        return baseLoanRowStatusBox.default;
    }
  };
  return (
    <Rows styleX={[baseRows.base, baseRows.flex1]}>
      <Columns>
        <Space styleX={customSpace.w50} />
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
            styleX={[baseColumn.base, baseColumn.columnLoanRow]}
          >
            <Space styleX={customSpace.w50} />
            <div {...stylex.props(baseLoanRowCell.base)}>
              {payment?.amortize}
            </div>
            <div {...stylex.props(baseLoanRowStatus.base)}>
              <div
                {...stylex.props(
                  baseLoanRowStatusBox.base,
                  statuPaymentsColor(payment.status)
                )}
              >
                {getStatusPayment(payment.status)}
              </div>
            </div>
            <div {...stylex.props(baseLoanRowCell.base)}>
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
      <Space styleX={customSpace.h30} />
    </Rows>
  );
};
