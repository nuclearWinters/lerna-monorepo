import React, { CSSProperties, FC } from "react";
import { graphql, useMutation, useRefetchableFragment } from "react-relay";
import { differenceInMonths, differenceInDays } from "date-fns";
import { getDataFromToken, tokensAndData } from "App";
import { LoanRowMutation } from "./__generated__/LoanRowMutation.graphql";
import { LoanRowRefetchQuery } from "./__generated__/LoanRowRefetchQuery.graphql";
import { LoanRow_loan$key } from "./__generated__/LoanRow_loan.graphql";

const loanRowRefetchableFragment = graphql`
  fragment LoanRow_loan on Loan @refetchable(queryName: "LoanRowRefetchQuery") {
    id
    _id_user
    score
    ROI
    goal
    term
    raised
    expiry
    status
  }
`;

type Props = {
  value: string;
  setLends: React.Dispatch<
    React.SetStateAction<
      {
        loan_gid: string;
        quantity: string;
        borrower_id: string;
      }[]
    >
  >;
  loan: LoanRow_loan$key;
};

export const LoanRow: FC<Props> = ({ setLends, loan, value }) => {
  const { isLender, isSupport } = tokensAndData.data;
  const [data, refetch] = useRefetchableFragment<
    LoanRowRefetchQuery,
    LoanRow_loan$key
  >(loanRowRefetchableFragment, loan);
  const [commitApproveLoan] = useMutation<LoanRowMutation>(graphql`
    mutation LoanRowMutation($input: ApproveLoanInput!) {
      approveLoan(input: $input) {
        error
        validAccessToken
      }
    }
  `);

  return (
    <div key={data.id} style={{ display: "flex", flexDirection: "row" }}>
      <div style={style.cell}>{data.id}</div>
      <div style={style.cell}>{data._id_user}</div>
      <div style={style.cell}>{data.score}</div>
      <div style={style.cell}>{data.ROI}%</div>
      <div style={style.cell}>${data.goal}</div>
      <div style={style.cell}>{data.term} meses</div>
      <div style={style.cell}>
        ${(Number(data.goal) - Number(data.raised)).toFixed(2)}
      </div>
      <div style={style.cell}>
        {differenceInMonths(data.expiry, new Date()) ??
          differenceInDays(data.expiry, new Date())}{" "}
        meses
      </div>
      {isLender ? (
        <input
          type="text"
          name={data.id}
          style={style.cell}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (isNaN(Number(val))) {
              return;
            }
            setLends((state) => {
              const idx = state.findIndex((lend) => data.id === lend.loan_gid);
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
                    borrower_id: data._id_user,
                  },
                ];
              }
              state[idx].quantity = val;
              return [...state];
            });
          }}
          onBlur={() => {
            setLends((state) => {
              const idx = state.findIndex((lend) => data.id === lend.loan_gid);
              if (idx === -1) {
                return state;
              }
              state[idx].quantity = Number(state[idx].quantity).toFixed(2);
              return [...state];
            });
          }}
        />
      ) : isSupport && data.status === "WAITING_FOR_APPROVAL" ? (
        <div style={style.cell}>
          <button
            onClick={() => {
              commitApproveLoan({
                variables: {
                  input: {
                    loan_gid: data.id,
                  },
                },
                onCompleted: (response) => {
                  if (response.approveLoan.error) {
                    throw new Error(response.approveLoan.error);
                  }
                },
                updater: (store, data) => {
                  tokensAndData.tokens.accessToken =
                    data.approveLoan.validAccessToken;
                  const user = getDataFromToken(
                    data.approveLoan.validAccessToken
                  );
                  tokensAndData.data = user;
                },
                onError: (error) => {
                  window.alert(error.message);
                },
              });
            }}
          >
            Aprobar
          </button>
        </div>
      ) : (
        <div style={style.cell}>{data.status}</div>
      )}
      <div style={style.cell}>
        <button
          onClick={() => {
            refetch({}, { fetchPolicy: "network-only" });
          }}
        >
          Refrescar
        </button>
      </div>
    </div>
  );
};

const style: Record<"cell", CSSProperties> = {
  cell: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    border: "1px solid black",
  },
};
