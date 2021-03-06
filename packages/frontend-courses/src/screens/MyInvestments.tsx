import React, { FC, useEffect, useRef } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MyInvestments_query$key } from "./__generated__/MyInvestments_query.graphql";
import { MyInvestmentsPaginationQuery } from "./__generated__/MyInvestmentsPaginationQuery.graphql";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { InvestmentRow } from "../components/InvestmentRow";
import { CustomButton } from "components/CustomButton";
import { Title } from "components/Title";
import { Main } from "components/Main";
import { WrapperBig } from "components/WrapperBig";
import { Select } from "components/Select";
import { Space } from "components/Space";
import { Columns } from "components/Colums";
import { Table } from "components/Table";
import { Rows } from "components/Rows";
import { TableColumnName } from "components/TableColumnName";
import { useTranslation } from "react-i18next";

const myInvestmentsFragment = graphql`
  fragment MyInvestments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
    status: {
      type: "[InvestmentStatus!]"
      defaultValue: [DELAY_PAYMENT, UP_TO_DATE, FINANCING]
    }
  )
  @refetchable(queryName: "MyInvestmentsPaginationQuery") {
    investments(first: $count, after: $cursor, user_id: $id, status: $status)
      @connection(key: "MyInvestments_query_investments") {
      edges {
        node {
          id
          ...InvestmentRow_investment
        }
      }
    }
  }
`;

type Props = {
  data: AppQueryResponse;
  setInvestmentStatus: React.Dispatch<
    React.SetStateAction<"on_going" | "over">
  >;
  investmentStatus: "on_going" | "over";
};

export const MyInvestments: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsPaginationQuery,
    MyInvestments_query$key
  >(myInvestmentsFragment, props.data);

  const columns = [
    { key: "id", title: t("ID") },
    { key: "_id_borrower", title: t("ID deudor") },
    { key: "_id_loan", title: t("ID deuda") },
    { key: "quantity", title: t("Cantidad") },
    { key: "status", title: t("Estatus") },
    { key: "paid", title: t("Pagado") },
    { key: "owe", title: t("Adeudo") },
    { key: "interests", title: t("Intereses") },
    { key: "moratory", title: t("Inter??s por mora") },
    { key: "created", title: t("Creado en") },
    { key: "updated", title: t("??ltimo cambio en") },
    { key: "refetch", title: t("Refrescar") },
  ];

  const handleInvestmentStatusOnChange = () => {
    props.setInvestmentStatus((state) => {
      return state === "on_going" ? "over" : "on_going";
    });
  };

  const statusRef = useRef(props.investmentStatus);

  useEffect(() => {
    const isDifferent = statusRef.current !== props.investmentStatus;
    if (isDifferent) {
      refetch(
        {
          status:
            props.investmentStatus === "on_going"
              ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
              : ["PAID", "PAST_DUE"],
        },
        { fetchPolicy: "network-only" }
      );
      statusRef.current = props.investmentStatus;
    }
  }, [props.investmentStatus, refetch]);

  return (
    <Main>
      <WrapperBig>
        <Title text={t("Mis inversiones")} />
        <Select
          value={props.investmentStatus}
          onChange={handleInvestmentStatusOnChange}
          options={[
            {
              value: "on_going",
              label: t("En curso"),
            },
            {
              value: "over",
              label: t("Terminados"),
            },
          ]}
        />
        <Table color="secondary">
          <Rows style={{ flex: 1 }}>
            <Columns>
              {columns.map((column) => (
                <TableColumnName key={column.key}>
                  {column.title}
                </TableColumnName>
              ))}
            </Columns>
            {data.investments &&
              data.investments.edges &&
              data.investments.edges.map((edge) => {
                if (edge && edge.node) {
                  return (
                    <InvestmentRow key={edge.node.id} investment={edge.node} />
                  );
                }
                return null;
              })}
          </Rows>
        </Table>
        <Space h={20} />
        <Columns
          style={{
            justifyContent: "center",
          }}
        >
          <CustomButton
            text={t("Cargar m??s")}
            color="secondary"
            onClick={() => loadNext(5)}
          />
          <Space w={20} />
          <CustomButton
            text={t("Refrescar lista")}
            color="secondary"
            onClick={() => refetch({}, { fetchPolicy: "network-only" })}
          />
        </Columns>
        <Space h={20} />
      </WrapperBig>
    </Main>
  );
};
