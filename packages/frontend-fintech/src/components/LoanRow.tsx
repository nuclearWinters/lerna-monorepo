import React, { FC, useMemo, useState } from "react";
import {
  graphql,
  useMutation,
  useRefetchableFragment,
  useSubscription,
} from "react-relay/hooks";
import { LoanRowMutation } from "./__generated__/LoanRowMutation.graphql";
import { LoanRowRefetchQuery } from "./__generated__/LoanRowRefetchQuery.graphql";
import { LoanRow_loan$key } from "./__generated__/LoanRow_loan.graphql";
import { useTranslation } from "utils";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { LoanRowUpdateSubscription } from "./__generated__/LoanRowUpdateSubscription.graphql";
import dayjs from "dayjs";
import { FaPlusSquare } from "@react-icons/all-files/fa/FaPlusSquare";
import { FaClipboard } from "@react-icons/all-files/fa/FaClipboard";
import { FaSyncAlt } from "@react-icons/all-files/fa/FaSyncAlt";
import { FaThumbsUp } from "@react-icons/all-files/fa/FaThumbsUp";
import { ScheduledPaymentRow } from "./ScheduledPaymentRow";
import { Languages } from "__generated__/AppUserQuery.graphql";
import * as stylex from "@stylexjs/stylex";

export const baseLoanRowIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(255,90,96)",
  },
});

export const baseLoanRowBorrowerIconBox = stylex.create({
  base: {
    width: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const baseLoanRowBorrowerIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(62,62,62)",
    cursor: "pointer",
    backgroundColor: "rgb(245,245,245)",
  },
});

export const baseLoanRowCell = stylex.create({
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

export const baseLoanRowInputBox = stylex.create({
  base: {
    flex: "1",
    backgroundColor: "white",
    alignItems: "center",
    color: "#333",
    display: "flex",
  },
});

export const baseLoanRowInput = stylex.create({
  base: {
    margin: "4px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#999",
    borderRadius: "4px",
    padding: "4px",
    width: "100%",
  },
});

export const baseLoanRowClipboard = stylex.create({
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

export const baseLoanRowScore = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    textAlign: "center",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const baseLoanRowScoreCircle = stylex.create({
  base: {
    borderRadius: "100%",
    backgroundColor: "rgb(102,141,78)",
    width: "30px",
    height: "30px",
    fontSize: "10px",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const baseLoanRowContainer = stylex.create({
  base: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
  },
});

export const baseLoanRowStatus = stylex.create({
  base: {
    flex: "1",
    backgroundColor: "white",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const baseLoanRowStatusBox = stylex.create({
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

const loanRowRefetchableFragment = graphql`
  fragment LoanRow_loan on Loan @refetchable(queryName: "LoanRowRefetchQuery") {
    id
    user_id
    score
    ROI
    goal
    term
    raised
    expiry
    status
    pending
    pendingCents
  }
`;

const subscriptionLoansUpdate = graphql`
  subscription LoanRowUpdateSubscription($gid: ID!) {
    loans_subscribe_update(gid: $gid) {
      id
      user_id
      score
      ROI
      goal
      term
      raised
      expiry
      status
      pending
      pendingCents
    }
  }
`;

type Props = {
  language: Languages;
  isLender: boolean;
  isSupport: boolean;
  isBorrower: boolean;
  value: string;
  setLends: React.Dispatch<
    React.SetStateAction<
      {
        loan_gid: string;
        quantity: string;
        borrower_id: string;
        goal: string;
        ROI: number;
        term: number;
      }[]
    >
  >;
  loan: LoanRow_loan$key;
};

export const LoanRow: FC<Props> = ({
  setLends,
  loan,
  value,
  isLender,
  isSupport,
  isBorrower,
  language,
}) => {
  const { t } = useTranslation();
  const [data, refetch] = useRefetchableFragment<
    LoanRowRefetchQuery,
    LoanRow_loan$key
  >(loanRowRefetchableFragment, loan);
  const [commitApproveLoan] = useMutation<LoanRowMutation>(graphql`
    mutation LoanRowMutation($input: ApproveLoanInput!) {
      approveLoan(input: $input) {
        error
        loan {
          id
          status
        }
      }
    }
  `);

  const getStatus = () => {
    switch (data.status) {
      case "FINANCING":
        return t("Financiando");
      case "PAID":
        return t("Pagado");
      case "PAST_DUE":
        return t("Vencido");
      case "TO_BE_PAID":
        return t("Por pagar");
      case "WAITING_FOR_APPROVAL":
        return t("Por aprobar");
      default:
        return "";
    }
  };

  const [showSubTable, setShowSubTable] = useState(false);

  const configLoansUpdate = useMemo<
    GraphQLSubscriptionConfig<LoanRowUpdateSubscription>
  >(
    () => ({
      variables: {
        gid: data.id,
      },
      subscription: subscriptionLoansUpdate,
    }),
    [data.id]
  );

  useSubscription<LoanRowUpdateSubscription>(configLoansUpdate);

  const now = dayjs();
  const expiry = dayjs(data.expiry);

  return (
    <>
      <div {...stylex.props(baseLoanRowContainer.base)}>
        {isBorrower && (
          <div {...stylex.props(baseLoanRowBorrowerIconBox.base)}>
            {data.status === "PAID" ||
              data.status === "PAST_DUE" ||
              (data.status === "TO_BE_PAID" && (
                <FaPlusSquare
                  onClick={() => {
                    setShowSubTable((state) => !state);
                  }}
                  {...stylex.props(baseLoanRowBorrowerIcon.base)}
                />
              ))}
          </div>
        )}
        <div {...stylex.props(baseLoanRowClipboard.base)}>
          <FaClipboard
            onClick={() => {
              navigator.clipboard.writeText(data.id);
            }}
            {...stylex.props(baseLoanRowIcon.base)}
          />
        </div>
        <div {...stylex.props(baseLoanRowClipboard.base)}>
          <FaClipboard
            onClick={() => {
              navigator.clipboard.writeText(data.user_id);
            }}
            {...stylex.props(baseLoanRowIcon.base)}
          />
        </div>
        <div {...stylex.props(baseLoanRowScore.base)}>
          <div {...stylex.props(baseLoanRowScoreCircle.base)}>{data.score}</div>
        </div>
        <div {...stylex.props(baseLoanRowCell.base)}>{data.ROI}%</div>
        <div {...stylex.props(baseLoanRowCell.base)}>{data.goal}</div>
        <div {...stylex.props(baseLoanRowCell.base)}>
          {data.term} {t("meses")}
        </div>
        <div {...stylex.props(baseLoanRowCell.base)}>{data.pending}</div>
        <div {...stylex.props(baseLoanRowCell.base)}>
          {expiry.diff(now, "months") || expiry.diff(now, "days")} {t("meses")}
        </div>
        {isLender ? (
          <div {...stylex.props(baseLoanRowInputBox.base)}>
            $
            <input
              type="text"
              name={data.id}
              {...stylex.props(baseLoanRowInput.base)}
              value={value}
              onChange={(e) => {
                const val = e.target.value.replace("e", "");
                if (isNaN(Number(val))) {
                  return;
                }
                setLends((state) => {
                  const idx = state.findIndex(
                    (lend) => data.id === lend.loan_gid
                  );
                  if (Number(val) === 0) {
                    state.splice(idx, 1);
                    return [...state];
                  }
                  if (idx === -1) {
                    return [
                      ...state,
                      {
                        loan_gid: data.id,
                        quantity: val,
                        borrower_id: data.user_id,
                        goal: data.goal,
                        term: data.term,
                        ROI: data.ROI,
                      },
                    ];
                  }
                  const pendingDollars = data.pendingCents / 100;
                  const quantity = Number(val);
                  if (Number(quantity) > pendingDollars) {
                    state[idx].quantity = String(pendingDollars);
                  } else {
                    state[idx].quantity = val;
                  }
                  return [...state];
                });
              }}
              onBlur={() => {
                setLends((state) => {
                  const idx = state.findIndex(
                    (lend) => data.id === lend.loan_gid
                  );
                  if (idx === -1) {
                    return state;
                  }
                  state[idx].quantity = Number(state[idx].quantity).toFixed(2);
                  return [...state];
                });
              }}
            />
          </div>
        ) : isSupport && data.status === "WAITING_FOR_APPROVAL" ? (
          <div
            {...stylex.props(baseLoanRowClipboard.base)}
            onClick={() => {
              commitApproveLoan({
                variables: {
                  input: {
                    loan_gid: data.id,
                  },
                },
              });
            }}
          >
            <FaThumbsUp {...stylex.props(baseLoanRowIcon.base)} />
          </div>
        ) : (
          <div {...stylex.props(baseLoanRowStatus.base)}>
            <div
              {...stylex.props(
                baseLoanRowStatusBox.base,
                data.status === "FINANCING"
                  ? baseLoanRowStatusBox.financing
                  : baseLoanRowStatusBox.default
              )}
            >
              {getStatus()}
            </div>
          </div>
        )}
        <div
          {...stylex.props(baseLoanRowClipboard.base)}
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          <FaSyncAlt {...stylex.props(baseLoanRowIcon.base)} />
        </div>
      </div>
      {showSubTable && (
        <ScheduledPaymentRow loan_gid={data.id} language={language} />
      )}
    </>
  );
};
