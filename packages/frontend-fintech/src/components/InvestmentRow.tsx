import { FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay/hooks";
import { InvestmentRowRefetchQuery } from "./__generated__/InvestmentRowRefetchQuery.graphql";
import { InvestmentRow_investment$key } from "./__generated__/InvestmentRow_investment.graphql";
import dayjs from "dayjs";
import { useTranslation } from "../utils";
import { FaClipboard } from "@react-icons/all-files/fa/FaClipboard";
import { FaSyncAlt } from "@react-icons/all-files/fa/FaSyncAlt";
import * as stylex from "@stylexjs/stylex";

export const baseInvestmentRowBox = stylex.create({
  base: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
  },
});

export const baseInvestmentRowClipboard = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
});

export const baseInvestmentRowCell = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
  },
});

export const baseInvestmentRowStatus = stylex.create({
  base: {
    flex: "1",
    backgroundColor: "white",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const baseInvestmentRowIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(90,96,255)",
  },
});

export const baseInvestmentRowStatusBar = stylex.create({
  base: {
    margin: "4px",
    borderRadius: "4px",
    textAlign: "center",
    flex: "1",
    padding: "3px 0px",
    color: "white",
  },
  delayPayment: {
    backgroundColor: "#FF9F00",
  },
  financing: {
    backgroundColor: "#4F7942",
  },
  paid: {
    backgroundColor: "#046307",
  },
  pastDue: {
    backgroundColor: "#CA3435",
  },
  upToDate: {
    backgroundColor: "#44d43b",
  },
  default: {
    backgroundColor: "white",
  },
});

const investmentRowRefetchableFragment = graphql`
  fragment InvestmentRow_investment on Investment
  @refetchable(queryName: "InvestmentRowRefetchQuery") {
    id
    borrower_id
    loan_id
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
        return baseInvestmentRowStatusBar.delayPayment;
      case "FINANCING":
        return baseInvestmentRowStatusBar.financing;
      case "PAID":
        return baseInvestmentRowStatusBar.paid;
      case "PAST_DUE":
        return baseInvestmentRowStatusBar.pastDue;
      case "UP_TO_DATE":
        return baseInvestmentRowStatusBar.upToDate;
      default:
        return baseInvestmentRowStatusBar.default;
    }
  };
  return (
    <div {...stylex.props(baseInvestmentRowBox.base)}>
      <div {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </div>
      <div {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.borrower_id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </div>
      <div {...stylex.props(baseInvestmentRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(data.loan_id);
          }}
          {...stylex.props(baseInvestmentRowIcon.base)}
        />
      </div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>{data.quantity}</div>
      <div {...stylex.props(baseInvestmentRowStatus.base)}>
        <div {...stylex.props(baseInvestmentRowStatusBar.base, statusStyle())}>
          {status()}
        </div>
      </div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>
        {data.paid_already}
      </div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>{data.to_be_paid}</div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>
        {data.interest_to_earn}
      </div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>{data.moratory}</div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>
        {dayjs(data.updated_at).format("DD/MM/YYYY")}
      </div>
      <div {...stylex.props(baseInvestmentRowCell.base)}>
        {dayjs(data.created_at).format("DD/MM/YYYY")}
      </div>
      <div
        {...stylex.props(baseInvestmentRowClipboard.base)}
        onClick={() => {
          refetch({}, { fetchPolicy: "network-only" });
        }}
      >
        <FaSyncAlt {...stylex.props(baseInvestmentRowIcon.base)} />
      </div>
    </div>
  );
};
