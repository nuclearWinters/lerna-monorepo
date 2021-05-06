import React, { CSSProperties, FC } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { DebtInSale_user$key } from "./__generated__/DebtInSale_user.graphql";
import { DebtInSalePaginationQuery } from "./__generated__/DebtInSalePaginationQuery.graphql";

const debtInSaleFragment = graphql`
  fragment DebtInSale_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "DebtInSalePaginationQuery") {
    loans(first: $count, after: $cursor)
      @connection(key: "DebtInSale_user_loans") {
      edges {
        node {
          id
          user_id
          score
          rate
          total
          term
          need
          ends
        }
      }
    }
  }
`;

type Props = {
  user: DebtInSale_user$key;
};

export const DebtInSale: FC<Props> = (props) => {
  const { data, loadNext } = usePaginationFragment<
    DebtInSalePaginationQuery,
    DebtInSale_user$key
  >(debtInSaleFragment, props.user);

  const columns = [
    { key: "id", title: "ID" },
    { key: "user_id", title: "Solicitante" },
    { key: "score", title: "Calif." },
    { key: "rate", title: "10" },
    { key: "total", title: "Monto" },
    { key: "term", title: "Periodo" },
    { key: "need", title: "Faltan" },
    { key: "ends", title: "Termina" },
    { key: "lend", title: "Prestar" },
  ];

  return (
    <div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {columns.map((column) => (
            <div key={column.title} style={{ flex: 1 }}>
              {column.title}
            </div>
          ))}
        </div>
        <div>
          {data.loans &&
            data.loans.edges &&
            data.loans.edges.map((edge) => (
              <div
                key={edge?.node?.id}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={style.cell}>{edge?.node?.id}</div>
                <div style={style.cell}>{edge?.node?.user_id}</div>
                <div style={style.cell}>{edge?.node?.score}</div>
                <div style={style.cell}>{edge?.node?.rate}</div>
                <div style={style.cell}>{edge?.node?.total}</div>
                <div style={style.cell}>{edge?.node?.term}</div>
                <div style={style.cell}>{edge?.node?.need}</div>
                <div style={style.cell}>{edge?.node?.ends}</div>
                <div style={style.cell}>{0}</div>
              </div>
            ))}
        </div>
        <button onClick={() => loadNext(5)}>loadNext</button>
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
