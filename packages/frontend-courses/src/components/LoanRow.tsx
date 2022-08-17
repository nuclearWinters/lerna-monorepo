import React, { CSSProperties, FC, useState } from "react";
import { graphql, useMutation, useRefetchableFragment } from "react-relay";
import { differenceInMonths, differenceInDays } from "date-fns";
import { tokensAndData } from "App";
import { LoanRowMutation } from "./__generated__/LoanRowMutation.graphql";
import { LoanRowRefetchQuery } from "./__generated__/LoanRowRefetchQuery.graphql";
import {
  LoanRow_loan$key,
  LoanScheduledPaymentStatus,
} from "./__generated__/LoanRow_loan.graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faClipboard,
  faThumbsUp,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { logOut } from "utils";
import { useTranslation } from "react-i18next";
import { Rows } from "./Rows";
import { Columns } from "./Colums";
import { TableColumnName } from "./TableColumnName";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import en from "date-fns/locale/en-US";
import { Space } from "./Space";
import { Languages } from "__generated__/Routes_query.graphql";

const loanRowRefetchableFragment = graphql`
  fragment LoanRow_loan on Loan @refetchable(queryName: "LoanRowRefetchQuery") {
    id
    id_user
    score
    ROI
    goal
    term
    raised
    expiry
    status
    scheduledPayments {
      amortize
      status
      scheduledDate
    }
    pending
    pendingCents
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
        validAccessToken
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

  const statuPaymentsColor = (status: LoanScheduledPaymentStatus) => {
    switch (status) {
      case "DELAYED":
        return "#FF9FF00";
      case "PAID":
        return "#44d43b";
      case "TO_BE_PAID":
        return "#046307";
      default:
        return "white";
    }
  };

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

  const [showSubTable, setShowSubTable] = useState(false);

  const columns = [
    { key: "amortize", title: t("Pago amortización") },
    { key: "status", title: t("Estatus") },
    { key: "scheduledDate", title: t("Fecha de pago") },
  ];

  return (
    <>
      <div style={style.container}>
        {isBorrower && (
          <div
            style={{
              width: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data.scheduledPayments && (
              <FontAwesomeIcon
                onClick={() => {
                  setShowSubTable((state) => !state);
                }}
                icon={faPlusSquare}
                size={"1x"}
                color={"rgb(62,62,62)"}
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgb(245,245,245)",
                }}
              />
            )}
          </div>
        )}
        <div style={style.clipboard}>
          <FontAwesomeIcon
            onClick={() => {
              navigator.clipboard.writeText(data.id);
            }}
            icon={faClipboard}
            size={"1x"}
            color={"rgb(255,90,96)"}
          />
        </div>
        <div style={style.clipboard}>
          <FontAwesomeIcon
            onClick={() => {
              navigator.clipboard.writeText(data.id_user);
            }}
            icon={faClipboard}
            size={"1x"}
            color={"rgb(255,90,96)"}
          />
        </div>
        <div style={style.score}>
          <div style={style.scoreCircle}>{data.score}</div>
        </div>
        <div style={style.cell}>{data.ROI}%</div>
        <div style={style.cell}>{data.goal}</div>
        <div style={style.cell}>
          {data.term} {t("meses")}
        </div>
        <div style={style.cell}>{data.pending}</div>
        <div style={style.cell}>
          {differenceInMonths(data.expiry, new Date()) ??
            differenceInDays(data.expiry, new Date())}{" "}
          {t("meses")}
        </div>
        {isLender ? (
          <div style={style.inputBox}>
            $
            <input
              type="text"
              name={data.id}
              style={style.input}
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
                        borrower_id: data.id_user,
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
            style={style.clipboard}
            onClick={() => {
              commitApproveLoan({
                variables: {
                  input: {
                    loan_gid: data.id,
                  },
                },
                onCompleted: (response) => {
                  if (response.approveLoan.error) {
                    if (response.approveLoan.error === "jwt expired") {
                      logOut();
                    }
                    return window.alert(response.approveLoan.error);
                  }
                  tokensAndData.accessToken =
                    response.approveLoan.validAccessToken;
                },
              });
            }}
          >
            <FontAwesomeIcon
              icon={faThumbsUp}
              size={"1x"}
              color={"rgb(255,90,96)"}
            />
          </div>
        ) : (
          <div style={style.status}>
            <div
              style={{
                ...style.statusBox,
                backgroundColor:
                  data.status === "FINANCING" ? "#4F7942" : "#FF9F00",
              }}
            >
              {getStatus()}
            </div>
          </div>
        )}
        <div
          style={style.clipboard}
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          <FontAwesomeIcon
            icon={faSyncAlt}
            size={"1x"}
            color={"rgb(255,90,96)"}
          />
        </div>
      </div>
      {showSubTable && (
        <Rows style={{ flex: 1 }}>
          <Columns>
            <Space w={50} />
            {columns.map((column) => (
              <TableColumnName key={column.key}>{column.title}</TableColumnName>
            ))}
          </Columns>
          {data.scheduledPayments?.map((payment) => {
            return (
              <Columns
                key={String(payment.scheduledDate)}
                style={{ marginBottom: 6 }}
              >
                <Space w={50} />
                <div style={style.cell}>{payment.amortize}</div>
                <div style={style.status}>
                  <div
                    style={{
                      ...style.statusBox,
                      backgroundColor: statuPaymentsColor(payment.status),
                      maxWidth: 200,
                    }}
                  >
                    {getStatusPayment(payment.status)}
                  </div>
                </div>
                <div style={style.cell}>
                  {format(
                    payment.scheduledDate,
                    "d 'de' MMMM 'del' yyyy 'a las' HH:mm:ss",
                    {
                      locale:
                        language === "DEFAULT"
                          ? navigator.language.includes("es")
                            ? es
                            : en
                          : language === "ES"
                          ? es
                          : en,
                    }
                  )}
                </div>
              </Columns>
            );
          })}
          <Space h={30} />
        </Rows>
      )}
    </>
  );
};

const style: Record<
  | "cell"
  | "inputBox"
  | "input"
  | "clipboard"
  | "score"
  | "scoreCircle"
  | "container"
  | "status"
  | "statusBox",
  CSSProperties
> = {
  cell: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
  },
  inputBox: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    color: "#333",
    display: "flex",
  },
  input: {
    margin: "4px",
    border: "1px solid #999",
    borderRadius: 4,
    padding: "4px",
    width: "100%",
  },
  clipboard: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
  score: {
    flex: 1,
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
  scoreCircle: {
    borderRadius: "100%",
    backgroundColor: "rgb(102,141,78)",
    width: 30,
    height: 30,
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  status: {
    flex: 1,
    backgroundColor: "white",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBox: {
    margin: "4px",
    borderRadius: 4,
    textAlign: "center",
    flex: 1,
    padding: "3px 0px",
    color: "white",
  },
};
