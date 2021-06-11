import React, { CSSProperties, FC, useEffect } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MyInvestments_query$key } from "./__generated__/MyInvestments_query.graphql";
import { MyInvestmentsPaginationQuery } from "./__generated__/MyInvestmentsPaginationQuery.graphql";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { tokensAndData } from "App";
import { InvestmentRow } from "../components/InvestmentRow";
import { CustomButton } from "components/CustomButton";

const myInvestmentsFragment = graphql`
  fragment MyInvestments_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 2 }
    cursor: { type: "String", defaultValue: "" }
    status: {
      type: "[InvestmentStatus!]!"
      defaultValue: [DELAY_PAYMENT, UP_TO_DATE]
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
  const { data, loadNext, refetch } = usePaginationFragment<
    MyInvestmentsPaginationQuery,
    MyInvestments_query$key
  >(myInvestmentsFragment, props.data);

  const columns = [
    { key: "id", title: "ID" },
    { key: "_id_borrower", title: "ID deudor" },
    { key: "_id_loan", title: "ID deuda" },
    { key: "quantity", title: "Cantidad" },
    { key: "status", title: "Estatus" },
    { key: "paid", title: "Pagado" },
    { key: "owe", title: "Adeudo" },
    { key: "interests", title: "Intereses" },
    { key: "moratory", title: "Interés por mora" },
    { key: "created", title: "Creado en:" },
    { key: "updated", title: "Último cambio en:" },
    { key: "refetch", title: "Actualizar" },
  ];

  const handleInvestmentStatusOnChange = () => {
    props.setInvestmentStatus((state) => {
      return state === "on_going" ? "over" : "on_going";
    });
  };

  useEffect(() => {
    refetch(
      {
        id: tokensAndData.data._id,
        status:
          props.investmentStatus === "on_going"
            ? ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"]
            : ["PAID", "PAST_DUE"],
      },
      { fetchPolicy: "network-only" }
    );
  }, [props.investmentStatus, refetch]);

  return (
    <div style={styles.main}>
      <div style={styles.wrapper}>
        <div style={styles.title}>Mis inversiones</div>
        <select
          value={props.investmentStatus}
          onChange={handleInvestmentStatusOnChange}
        >
          <option value="on_going">En curso</option>
          <option value="over">Terminados</option>
        </select>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            margin: "10px 10px",
            backgroundColor: "rgba(90,96,255,0.1)",
            borderRadius: 8,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "4px 0px",
                color: "rgb(62,62,62)",
              }}
            >
              {columns.map((column) => (
                <div key={column.key} style={{ flex: 1, textAlign: "center" }}>
                  {column.title}
                </div>
              ))}
            </div>
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
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0px",
          }}
        >
          <CustomButton
            text="Cargar más"
            style={{ marginRight: 10, backgroundColor: "#1bbc9b" }}
            onClick={() => loadNext(5)}
          />
          <CustomButton
            text="Reiniciar lista"
            style={{ marginLeft: 10 }}
            onClick={() =>
              refetch(
                {
                  id: tokensAndData.data._id,
                },
                { fetchPolicy: "network-only" }
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<"wrapper" | "main" | "title", CSSProperties> = {
  wrapper: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 20px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  main: {
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
};
