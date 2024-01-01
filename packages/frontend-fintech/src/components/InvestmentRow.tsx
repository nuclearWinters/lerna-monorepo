import React, { FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay/hooks";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";
import dayjs from "dayjs";
import { useTranslation } from "utils";
import { FaClipboard, FaSyncAlt } from "react-icons/fa";
import {
  baseInvestmentRowBox,
  baseInvestmentRowCell,
  baseInvestmentRowClipboard,
  baseInvestmentRowIcon,
  baseInvestmentRowStatus,
  customInvestmentRowStatusBar,
} from "./InvestmentRow.css";

const investmentRowRefetchableFragment = graphql`
  fragment InvestmentRow_investment on Investment
  @refetchable(queryName: "InvestmentRowRefetchQuery") {
    id
    id_borrower
    _id_loan
    quantity
    created_at
    updated_at
    status
    payments
    ROI
    term
    moratory
    interest_to_earn
    paid_already
    to_be_paid
  }
`;

type Props = {
  investment: InvestmentRow_investment$key;
};

export const InvestmentRow: FC<Props> = ({ investment }) => {
  const { t } = useTranslation();
  const [data, refetch] = useRefetchableFragment<
    InvestmentRowRefetchQuery,
    InvestmentRow_investment$key
  >(investmentRowRefetchableFragment, investment);
  const status = () => {
    switch (data.status) {
      case "DELAY_PAYMENT":
        return t("Atrasado");
      case "FINANCING":
        return t("Financiandose");
      case "PAID":
        return t("Pagado");
      case "PAST_DUE":
        return t("Vencido");
      case "UP_TO_DATE":
        return t("Al día");
      default:
        return "";
    }
  };
  const statusStyle = () => {
    switch (data.status) {
      case "DELAY_PAYMENT":
        return customInvestmentRowStatusBar["delayPayment"];
      case "FINANCING":
        return customInvestmentRowStatusBar["financing"];
      case "PAID":
        return customInvestmentRowStatusBar["paid"];
      case "PAST_DUE":
        return customInvestmentRowStatusBar["pastDue"];
      case "UP_TO_DATE":
        return customInvestmentRowStatusBar["upToDate"];
      default:
        return customInvestmentRowStatusBar["default"];
    }
  };
  return (
    <div className={baseInvestmentRowBox}>
      <div className={baseInvestmentRowClipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.id);
          }}
          className={baseInvestmentRowIcon}
        />
      </div>
      <div className={baseInvestmentRowClipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.id_borrower);
          }}
          className={baseInvestmentRowIcon}
        />
      </div>
      <div className={baseInvestmentRowClipboard}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data._id_loan);
          }}
          className={baseInvestmentRowIcon}
        />
      </div>
      <div className={baseInvestmentRowCell}>{data.quantity}</div>
      <div className={baseInvestmentRowStatus}>
        <div className={statusStyle()}>{status()}</div>
      </div>
      <div className={baseInvestmentRowCell}>{data.paid_already}</div>
      <div className={baseInvestmentRowCell}>{data.to_be_paid}</div>
      <div className={baseInvestmentRowCell}>{data.interest_to_earn}</div>
      <div className={baseInvestmentRowCell}>{data.moratory}</div>
      <div className={baseInvestmentRowCell}>
        {dayjs(data.updated_at).format("DD/MM/YYYY")}
      </div>
      <div className={baseInvestmentRowCell}>
        {dayjs(data.created_at).format("DD/MM/YYYY")}
      </div>
      <div
        className={baseInvestmentRowClipboard}
        onClick={() => {
          refetch({}, { fetchPolicy: "network-only" });
        }}
      >
        <FaSyncAlt className={baseInvestmentRowIcon} />
      </div>
    </div>
  );
};
