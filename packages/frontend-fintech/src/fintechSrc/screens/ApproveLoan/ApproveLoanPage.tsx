import { FC, Fragment, useMemo, useState } from "react";

import {
  ConnectionHandler,
  PreloadedQuery,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
  useRefetchableFragment,
  useSubscription,
} from "react-relay/hooks";
import { CustomButton } from "../../../components/CustomButton";
import { Main } from "../../../components/Main";
import { Title } from "../../../components/Title";
import { WrapperBig } from "../../../components/WrapperBig";
import { Space, customSpace } from "../../../components/Space";
import { Columns, baseColumn } from "../../../components/Colums";
import { TableColumnName } from "../../../components/TableColumnName";
import { Table } from "../../../components/Table";
import { useTranslation } from "../../../utils";
import {
  ApproveLoansQueriesPaginationFragment,
  approveLoanQueriesRowRefetchableFragment,
  approveLoansFragment,
  subscriptionApproveLoanUpdate,
  subscriptionApproveLoans,
} from "./ApproveLoanQueries";
import { ApproveLoansQueriesPaginationUser } from "./__generated__/ApproveLoansQueriesPaginationUser.graphql";
import { ApproveLoanQueries_user$key } from "./__generated__/ApproveLoanQueries_user.graphql";
import { ApproveLoanQueriesQuery } from "./__generated__/ApproveLoanQueriesQuery.graphql";
import { ApproveLoanQueriesSubscription } from "./__generated__/ApproveLoanQueriesSubscription.graphql";
import { GraphQLSubscriptionConfig, graphql } from "relay-runtime";
import * as stylex from "@stylexjs/stylex";
import { FaClipboard } from "@react-icons/all-files/fa/FaClipboard";
import { FaSyncAlt } from "@react-icons/all-files/fa/FaSyncAlt";
import { FaThumbsUp } from "@react-icons/all-files/fa/FaThumbsUp";
import dayjs from "dayjs";
import { ApproveLoanQueriesUpdateSubscription } from "./__generated__/ApproveLoanQueriesUpdateSubscription.graphql";
import { ApproveLoanPageMutation } from "./__generated__/ApproveLoanPageMutation.graphql";
import { ApproveLoanQueriesRowRefetch_loan$key } from "./__generated__/ApproveLoanQueriesRowRefetch_loan.graphql";
import { ApproveLoanQueriesRefetchQuery } from "./__generated__/ApproveLoanQueriesRefetchQuery.graphql";

type Props = {
  fintechQuery: PreloadedQuery<
    ApproveLoanQueriesQuery,
    Record<string, unknown>
  >;
};

const baseLoanRowContainer = stylex.create({
  base: {
    backgroundColor: "white",
    height: "50px",
  },
});

const baseLoanRowClipboard = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
    display: "table-cell",
    minWidth: "60px",
  },
});

const baseLoanRowIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(255,90,96)",
    margin: "auto",
  },
});

const baseLoanRowScore = stylex.create({
  base: {
    textAlign: "center",
    color: "#333",
    display: "table-cell",
    minWidth: "80px",
  },
});

const baseLoanRowScoreCircle = stylex.create({
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
    margin: "auto",
  },
});

const baseLoanRowCell = stylex.create({
  base: {
    display: "table-cell",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    minWidth: "100px",
  },
});

const ApproveLoanCell: FC<{
  loan_gid: string;
}> = ({ loan_gid }) => {
  const [commitApproveLoan] = useMutation<ApproveLoanPageMutation>(graphql`
    mutation ApproveLoanPageMutation($input: ApproveLoanInput!) {
      approveLoan(input: $input) {
        error
        loan {
          id
          status
        }
      }
    }
  `);

  const configLoansUpdate = useMemo<
    GraphQLSubscriptionConfig<ApproveLoanQueriesUpdateSubscription>
  >(
    () => ({
      variables: {
        gid: loan_gid,
      },
      subscription: subscriptionApproveLoanUpdate,
    }),
    [loan_gid]
  );

  useSubscription<ApproveLoanQueriesUpdateSubscription>(configLoansUpdate);

  return (
    <td
      {...stylex.props(baseLoanRowClipboard.base)}
      onClick={() => {
        commitApproveLoan({
          variables: {
            input: {
              loan_gid,
            },
          },
        });
      }}
    >
      <FaThumbsUp {...stylex.props(baseLoanRowIcon.base)} />
    </td>
  );
};

const RefetchCell: FC<{ loan: ApproveLoanQueriesRowRefetch_loan$key }> = ({
  loan,
}) => {
  const [, refetch] = useRefetchableFragment<
    ApproveLoanQueriesRefetchQuery,
    ApproveLoanQueriesRowRefetch_loan$key
  >(approveLoanQueriesRowRefetchableFragment, loan);
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

const columnApproveLoans: {
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
    };
    t: (text: string) => string;
    loan: ApproveLoanQueriesRowRefetch_loan$key;
  }) => JSX.Element;
}[] = [
  {
    id: "id",
    header: (t) => <TableColumnName>{t("ID")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.id);
          }}
          {...stylex.props(baseLoanRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "user_id",
    header: (t) => <TableColumnName>{t("Solicitante")}</TableColumnName>,
    cell: ({ info, t }) => (
      <td {...stylex.props(baseLoanRowClipboard.base)}>
        <FaClipboard
          onClick={() => {
            navigator.clipboard.writeText(info.id);
          }}
          {...stylex.props(baseLoanRowIcon.base)}
        />
      </td>
    ),
  },
  {
    id: "score",
    header: (t) => <TableColumnName>{t("Calif.")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowScore.base)}>
        <div {...stylex.props(baseLoanRowScoreCircle.base)}>{info.score}</div>
      </td>
    ),
  },
  {
    id: "ROI",
    header: (t) => <TableColumnName>{t("Retorno anual")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.ROI}%</td>
    ),
  },
  {
    id: "goal",
    header: (t) => <TableColumnName>{t("Monto")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.goal}</td>
    ),
  },
  {
    id: "term",
    header: (t) => <TableColumnName>{t("Periodo")}</TableColumnName>,
    cell: ({ info, t }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>
        {info.term} {t("meses")}
      </td>
    ),
  },
  {
    id: "pending",
    header: (t) => <TableColumnName>{t("Faltan")}</TableColumnName>,
    cell: ({ info }) => (
      <td {...stylex.props(baseLoanRowCell.base)}>{info.pending}</td>
    ),
  },
  {
    id: "expiry",
    header: (t) => <TableColumnName>{t("Termina")}</TableColumnName>,
    cell: ({ info, t }) => {
      const now = dayjs();
      const expiry = dayjs(info.expiry);
      return (
        <td {...stylex.props(baseLoanRowCell.base)}>
          {expiry.diff(now, "months") || expiry.diff(now, "days")} {t("meses")}
        </td>
      );
    },
  },
  {
    id: "status",
    header: (t) => <TableColumnName>{t("Estatus")}</TableColumnName>,
    cell: ({ info }) => <ApproveLoanCell loan_gid={info.id} />,
  },
  {
    id: "refetch",
    header: (t) => <TableColumnName>{t("Refrescar")}</TableColumnName>,
    cell: ({ loan }) => <RefetchCell loan={loan} />,
  },
];

export const ApproveLoansPage: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [reset, setReset] = useState(0);
  const { user } = usePreloadedQuery(approveLoansFragment, props.fintechQuery);
  const { data, loadNext, refetch } = usePaginationFragment<
    ApproveLoansQueriesPaginationUser,
    ApproveLoanQueries_user$key
  >(ApproveLoansQueriesPaginationFragment, user);

  const connectionApproveLoansID = ConnectionHandler.getConnectionID(
    user?.id || "",
    "ApproveLoansQueries_user_approveLoans",
    {
      reset,
    }
  );

  const configApproveLoans = useMemo<
    GraphQLSubscriptionConfig<ApproveLoanQueriesSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionApproveLoansID],
        reset,
      },
      subscription: subscriptionApproveLoans,
    }),
    [connectionApproveLoansID, reset]
  );

  useSubscription<ApproveLoanQueriesSubscription>(configApproveLoans);

  if (!user) {
    return null;
  }

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Solicitudes")} />
        <Table color="primary">
          <thead>
            <tr>
              {columnApproveLoans.map((column) => (
                <Fragment key={column.id}>{column.header(t)}</Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.approveLoans?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }
              const { id, user_id, score, ROI, goal, term, expiry, pending } =
                edge.node;
              return (
                <tr key={node.id} {...stylex.props(baseLoanRowContainer.base)}>
                  {columnApproveLoans.map((column) => (
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
                          pending,
                        },
                        t,
                        loan: node,
                      })}
                    </Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
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
