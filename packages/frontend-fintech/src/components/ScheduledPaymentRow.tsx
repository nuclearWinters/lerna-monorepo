import { FC, Fragment } from "react";
import { customSpace } from "./Space";
import { TableColumnName } from "./TableColumnName";
import dayjs from "dayjs";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import { Languages, useTranslation } from "../utils";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import {
  LoanScheduledPaymentStatus,
  ScheduledPaymentRowQuery,
} from "./__generated__/ScheduledPaymentRowQuery.graphql";
import * as stylex from "@stylexjs/stylex";

const baseLoanRowCell = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
  },
});

const baseLoanRowStatus = stylex.create({
  base: {
    color: "#333",
    display: "table-cell",
  },
});

const baseLoanRowStatusBox = stylex.create({
  base: {
    padding: "4px",
    borderRadius: "4px",
    textAlign: "center",
    flex: "1",
    color: "white",
  },
  financing: {
    backgroundColor: "#4F7942",
  },
  default: {
    backgroundColor: "#FF9F00",
  },
  scheduledPaymentsDelayed: {
    backgroundColor: "#FF9F00",
    maxWidth: "200px",
  },
  scheduledPaymentsPaid: {
    backgroundColor: "#44d43b",
    maxWidth: "200px",
  },
  scheduledPaymentsToBePaid: {
    backgroundColor: "#046307",
    maxWidth: "200px",
  },
  scheduledPaymentsDefault: {
    backgroundColor: "white",
    maxWidth: "200px",
  },
});

const columns: {
  id: string;
  header: (t: (text: string) => string) => JSX.Element;
  cell: (info: {
    info: {
      amortize: string;
      id: string;
      loan_id: string;
      scheduledDate: number;
      status: LoanScheduledPaymentStatus;
    };
    t: (text: string) => string;
    languageEnum: "EN" | "ES";
  }) => JSX.Element;
}[] = [
  {
    id: "space",
    header: () => <th {...stylex.props(customSpace.w50)} />,
    cell: () => <td />,
  },
  {
    id: "amortize",
    header: (t) => (
      <TableColumnName colspan={3}>{t("Pago amortización")}</TableColumnName>
    ),
    cell: ({ info }) => (
      <td colSpan={3} {...stylex.props(baseLoanRowCell.base)}>
        {info.amortize}
      </td>
    ),
  },
  {
    id: "status",
    header: (t) => <TableColumnName>{t("Estatus")}</TableColumnName>,
    cell: ({ info, t }) => {
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
        <td {...stylex.props(baseLoanRowStatus.base)}>
          <div
            {...stylex.props(
              baseLoanRowStatusBox.base,
              statuPaymentsColor(info.status)
            )}
          >
            {getStatusPayment(info.status)}
          </div>
        </td>
      );
    },
  },
  {
    id: "scheduledDate",
    header: (t) => (
      <TableColumnName colspan={3}>{t("Fecha de pago")}</TableColumnName>
    ),
    cell: ({ info, languageEnum }) => (
      <td colSpan={3} {...stylex.props(baseLoanRowCell.base)}>
        {dayjs(info.scheduledDate)
          .locale(languageEnum === "ES" ? es : en)
          .format(
            languageEnum === "ES"
              ? "D [de] MMMM [del] YYYY [a las] h:mm a"
              : "D MMMM[,] YYYY [at] h:mm a"
          )}
      </td>
    ),
  },
];

export const ScheduledPaymentRow: FC<{
  loan_gid: string;
  language: Languages;
}> = ({ loan_gid, language }) => {
  const { t } = useTranslation();
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

  const languageEnum = language === "ES" ? "ES" : "EN";

  return (
    <>
      <tr>
        {columns.map((column) => (
          <Fragment key={column.id}>{column.header(t)}</Fragment>
        ))}
      </tr>
      {data.scheduledPaymentsbyLoanId?.map((payment) => {
        if (!payment) {
          return null;
        }
        return (
          <tr key={String(payment.id)}>
            {columns.map((column) => (
              <Fragment key={column.id}>
                {column.cell({ info: payment, t, languageEnum })}
              </Fragment>
            ))}
          </tr>
        );
      })}
      <tr {...stylex.props(customSpace.h10)} />
    </>
  );
};
