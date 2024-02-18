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
import {
  FaPlusSquare,
  FaClipboard,
  FaSyncAlt,
  FaThumbsUp,
} from "react-icons/fa";
import {
  baseLoanRowBorrowerIcon,
  baseLoanRowBorrowerIconBox,
  baseLoanRowCell,
  baseLoanRowClipboard,
  baseLoanRowContainer,
  baseLoanRowIcon,
  baseLoanRowInput,
  baseLoanRowInputBox,
  baseLoanRowScore,
  baseLoanRowScoreCircle,
  baseLoanRowStatus,
  customLoanRowStatusBox,
} from "./LoanRow.css";
import { ScheduledPaymentRow } from "./ScheduledPaymentRow";
import { Languages } from "__generated__/AppUserQuery.graphql";

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
      <div className={baseLoanRowContainer}>
        {isBorrower && (
          <div className={baseLoanRowBorrowerIconBox}>
            {data.status === "PAID" ||
              data.status === "PAST_DUE" ||
              (data.status === "TO_BE_PAID" && (
                <FaPlusSquare
                  onClick={() => {
                    setShowSubTable((state) => !state);
                  }}
                  className={baseLoanRowBorrowerIcon}
                />
              ))}
          </div>
        )}
        <div className={baseLoanRowClipboard}>
          <FaClipboard
            onClick={() => {
              navigator.clipboard.writeText(data.id);
            }}
            className={baseLoanRowIcon}
          />
        </div>
        <div className={baseLoanRowClipboard}>
          <FaClipboard
            onClick={() => {
              navigator.clipboard.writeText(data.user_id);
            }}
            className={baseLoanRowIcon}
          />
        </div>
        <div className={baseLoanRowScore}>
          <div className={baseLoanRowScoreCircle}>{data.score}</div>
        </div>
        <div className={baseLoanRowCell}>{data.ROI}%</div>
        <div className={baseLoanRowCell}>{data.goal}</div>
        <div className={baseLoanRowCell}>
          {data.term} {t("meses")}
        </div>
        <div className={baseLoanRowCell}>{data.pending}</div>
        <div className={baseLoanRowCell}>
          {expiry.diff(now, "months") || expiry.diff(now, "days")} {t("meses")}
        </div>
        {isLender ? (
          <div className={baseLoanRowInputBox}>
            $
            <input
              type="text"
              name={data.id}
              className={baseLoanRowInput}
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
            className={baseLoanRowClipboard}
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
            <FaThumbsUp className={baseLoanRowIcon} />
          </div>
        ) : (
          <div className={baseLoanRowStatus}>
            <div
              className={
                data.status === "FINANCING"
                  ? customLoanRowStatusBox["financing"]
                  : customLoanRowStatusBox["default"]
              }
            >
              {getStatus()}
            </div>
          </div>
        )}
        <div
          className={baseLoanRowClipboard}
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          <FaSyncAlt className={baseLoanRowIcon} />
        </div>
      </div>
      {showSubTable && (
        <ScheduledPaymentRow loan_id={data.id} language={language} />
      )}
    </>
  );
};
