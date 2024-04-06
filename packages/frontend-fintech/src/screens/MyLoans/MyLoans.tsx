import { Dispatch, FC, Fragment, useMemo, useState } from "react";
import {
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useRefetchableFragment,
  useSubscription,
} from "react-relay/hooks";
import { CustomButton } from "../../components/CustomButton";
import { Main } from "../../components/Main";
import { Title } from "../../components/Title";
import { WrapperBig } from "../../components/WrapperBig";
import { Rows, baseRows } from "../../components/Rows";
import { Space, customSpace } from "../../components/Space";
import { Columns, baseColumn } from "../../components/Colums";
import { TableColumnName } from "../../components/TableColumnName";
import { Table } from "../../components/Table";
import { Languages, authUserQuery, useTranslation } from "../../utils";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import {
  myLoansFragment,
  myLoansPaginationFragment,
  myLoansQueriesRowRefetchableFragment,
  subscriptionMyLoans,
  subscriptionMyLoansUpdate,
} from "./MyLoansQueries";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";
import { RedirectContainer } from "../../components/RedirectContainer";
import { MyLoansQueriesPaginationUser } from "./__generated__/MyLoansQueriesPaginationUser.graphql";
import { MyLoansQueries_user$key } from "./__generated__/MyLoansQueries_user.graphql";
import { MyLoansQueriesQuery } from "./__generated__/MyLoansQueriesQuery.graphql";
import { MyLoansQueriesSubscription } from "./__generated__/MyLoansQueriesSubscription.graphql";
import { FaPlusSquare } from "@react-icons/all-files/fa/FaPlusSquare";
import { FaClipboard } from "@react-icons/all-files/fa/FaClipboard";
import { FaSyncAlt } from "@react-icons/all-files/fa/FaSyncAlt";
import dayjs from "dayjs";
import * as stylex from "@stylexjs/stylex";
import { ScheduledPaymentRow } from "../../components/ScheduledPaymentRow";
import { MyLoansQueriesUpdateSubscription } from "./__generated__/MyLoansQueriesUpdateSubscription.graphql";
import { MyLoansQueriesRowRefetch_loan$key } from "./__generated__/MyLoansQueriesRowRefetch_loan.graphql";
import { MyLoansQueriesRefetchQuery } from "./__generated__/MyLoansQueriesRefetchQuery.graphql";

type Props = {
  query: PreloadedQuery<MyLoansQueriesQuery, {}>;
  authQuery: PreloadedQuery<utilsQuery, {}>;
};

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

export const baseLoanRowContainer = stylex.create({
  base: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
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

export const baseLoanRowIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(255,90,96)",
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

const getStatus = (status: StatusLoan, t: (name: string) => string) => {
  switch (status) {
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

type StatusLoan =
  | "PAID"
  | "TO_BE_PAID"
  | "FINANCING"
  | "WAITING_FOR_APPROVAL"
  | "PAST_DUE";

const Cell: FC<{ id: string }> = ({ id }) => {
  const configLoansUpdate = useMemo<
    GraphQLSubscriptionConfig<MyLoansQueriesUpdateSubscription>
  >(
    () => ({
      variables: {
        gid: id,
      },
      subscription: subscriptionMyLoansUpdate,
    }),
    [id]
  );

  useSubscription<MyLoansQueriesUpdateSubscription>(configLoansUpdate);

  return (
    <div {...stylex.props(baseLoanRowClipboard.base)}>
      <FaClipboard
        onClick={() => {
          navigator.clipboard.writeText(id);
        }}
        {...stylex.props(baseLoanRowIcon.base)}
      />
    </div>
  );
};

const RefetchCell: FC<{ loan: MyLoansQueriesRowRefetch_loan$key }> = ({
  loan,
}) => {
  const [, refetch] = useRefetchableFragment<
    MyLoansQueriesRefetchQuery,
    MyLoansQueriesRowRefetch_loan$key
  >(myLoansQueriesRowRefetchableFragment, loan);
  return (
    <td
      {...stylex.props(baseLoanRowClipboard.base)}
      onClick={() => {
        refetch({}, { fetchPolicy: "network-only" });
      }}
    >
      <FaSyncAlt {...stylex.props(baseLoanRowIcon.base)} />
    </td>
  );
};

const columnMyLoans: {
  id: string;
  header: (t: (text: string) => string) => JSX.Element;
  cell: (info: {
    info: {
      id: string;
      user_id: string;
      score: string;
      ROI: number;
      goal: string;
      term: number;
      pending: string;
      expiry: number;
      status: StatusLoan;
    };
    t: (text: string) => string;
    setShowSubTable: Dispatch<React.SetStateAction<boolean>>;
    loan: MyLoansQueriesRowRefetch_loan$key;
  }) => JSX.Element;
}[] = [
  {
    id: "space",
    header: (t) => <Space styleX={customSpace.w50} />,
    cell: ({ info, setShowSubTable }) => (
      <div {...stylex.props(baseLoanRowBorrowerIconBox.base)}>
        {info.status === "PAID" ||
          info.status === "PAST_DUE" ||
          (info.status === "TO_BE_PAID" && (
            <FaPlusSquare
              onClick={() => {
                setShowSubTable((state) => !state);
              }}
              {...stylex.props(baseLoanRowBorrowerIcon.base)}
            />
          ))}
      </div>
    ),
  },
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => <Cell id={info.id} />,
  },
  {
    id: "user_id",
    header: (t) => <TableColumnName>{t("Solicitante")}</TableColumnName>,
    cell: ({ info, t }) => (
      <div {...stylex.props(baseLoanRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.id);
          }}
          {...stylex.props(baseLoanRowIcon.base)}
        />
      </div>
    ),
  },
  {
    id: "score",
    header: (t) => <TableColumnName>{t("Calif.")}</TableColumnName>,
    cell: ({ info }) => (
      <div {...stylex.props(baseLoanRowScore.base)}>
        <div {...stylex.props(baseLoanRowScoreCircle.base)}>{info.score}</div>
      </div>
    ),
  },
  {
    id: "ROI",
    header: (t) => <TableColumnName>{t("Retorno anual")}</TableColumnName>,
    cell: ({ info }) => (
      <div {...stylex.props(baseLoanRowCell.base)}>{info.ROI}%</div>
    ),
  },
  {
    id: "goal",
    header: (t) => <TableColumnName>{t("Monto")}</TableColumnName>,
    cell: ({ info }) => (
      <div {...stylex.props(baseLoanRowCell.base)}>{info.goal}</div>
    ),
  },
  {
    id: "term",
    header: (t) => <TableColumnName>{t("Periodo")}</TableColumnName>,
    cell: ({ info, t }) => (
      <div {...stylex.props(baseLoanRowCell.base)}>
        {info.term} {t("meses")}
      </div>
    ),
  },
  {
    id: "pending",
    header: (t) => <TableColumnName>{t("Faltan")}</TableColumnName>,
    cell: ({ info }) => (
      <div {...stylex.props(baseLoanRowCell.base)}>{info.pending}</div>
    ),
  },
  {
    id: "expiry",
    header: (t) => <TableColumnName>{t("Termina")}</TableColumnName>,
    cell: ({ info, t }) => {
      const now = dayjs();
      const expiry = dayjs(info.expiry);
      return (
        <div {...stylex.props(baseLoanRowCell.base)}>
          {expiry.diff(now, "months") || expiry.diff(now, "days")} {t("meses")}
        </div>
      );
    },
  },
  {
    id: "status",
    header: (t) => <TableColumnName>{t("Estatus")}</TableColumnName>,
    cell: ({ info, t }) => (
      <div {...stylex.props(baseLoanRowStatus.base)}>
        <div
          {...stylex.props(
            baseLoanRowStatusBox.base,
            info.status === "FINANCING"
              ? baseLoanRowStatusBox.financing
              : baseLoanRowStatusBox.default
          )}
        >
          {getStatus(info.status, t)}
        </div>
      </div>
    ),
  },
  {
    id: "refetch",
    header: (t) => <TableColumnName>{t("Refrescar")}</TableColumnName>,
    cell: ({ loan }) => <RefetchCell loan={loan} />,
  },
];

export const MyLoans: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const [showSubTable, setShowSubTable] = useState(false);
  const { user } = usePreloadedQuery(myLoansFragment, props.query);
  const { authUser } = usePreloadedQuery(authUserQuery, props.authQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    MyLoansQueriesPaginationUser,
    MyLoansQueries_user$key
  >(myLoansPaginationFragment, user);

  const connectionMyLoansID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "MyLoansQueries_user_myLoans",
    {
      reset,
    }
  );

  const configMyLoans = useMemo<
    GraphQLSubscriptionConfig<MyLoansQueriesSubscription>
  >(
    () => ({
      variables: {
        reset,
        connections: [connectionMyLoansID],
      },
      subscription: subscriptionMyLoans,
    }),
    [connectionMyLoansID, reset]
  );

  useSubscription<MyLoansQueriesSubscription>(configMyLoans);

  if (!authUser || !user) {
    return null;
  }

  const { isLender, isSupport, isBorrower, language } = authUser;

  if (isLender || isSupport) {
    return (
      <RedirectContainer
        allowed={["borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <Rows styleX={[baseRows.base, baseRows.flex1]}>
            <Columns>
              <Space styleX={customSpace.w30} />
              {columnMyLoans.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </Columns>
            {data?.myLoans?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const {
                id,
                user_id,
                score,
                ROI,
                goal,
                term,
                expiry,
                status,
                pending,
              } = edge.node;
              return (
                <div {...stylex.props(baseLoanRowContainer.base)}>
                  {columnMyLoans.map((column) => (
                    <Fragment key={column.id}>
                      {column.cell({
                        info: {
                          id,
                          user_id,
                          score,
                          ROI,
                          goal,
                          term,
                          expiry,
                          status: status as StatusLoan,
                          pending,
                        },
                        t,
                        setShowSubTable,
                        loan: node,
                      })}
                      {showSubTable && (
                        <ScheduledPaymentRow
                          loan_gid={data.id}
                          language={language as Languages}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </Rows>
        </Table>
        <Space styleX={customSpace.h20} />
        <Columns styleX={[baseColumn.base, baseColumn.columnJustifyCenter]}>
          <CustomButton
            color="secondary"
            text={t("Cargar más")}
            onClick={() => loadNext(5)}
          />
          <Space styleX={customSpace.w20} />
          <CustomButton
            text={t("Reiniciar lista")}
            color="secondary"
            onClick={() => {
              const time = new Date().getTime();
              setReset(time);
              refetch(
                {
                  count: 5,
                  cursor: "",
                  reset: time,
                },
                { fetchPolicy: "network-only" }
              );
            }}
          />
        </Columns>
        <Space styleX={customSpace.h20} />
      </WrapperBig>
    </Main>
  );
};

export default MyLoans;
