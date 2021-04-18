import React, { FC, useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { Table } from "../components/Table";

interface Props {}

const EditableCell: FC<any> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  switch (id) {
    case "lend":
      return (
        <>
          ${" "}
          <input
            value={value === "0" ? "" : value}
            onChange={onChange}
            onBlur={onBlur}
          />
        </>
      );
    default:
      return <>{value}</>;
  }
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const hardData = [
  {
    id: "1",
    user_id: "1",
    score: 1,
    rate: 0.1,
    total: 1000000,
    term: 12,
    need: 500000,
    ends: 10,
    lend: 0,
  },
  {
    id: "2",
    user_id: "5",
    score: 1,
    rate: 0.1,
    total: 1000000,
    term: 12,
    need: 500000,
    ends: 10,
    lend: 0,
  },
  {
    id: "2",
    user_id: "3",
    score: 1,
    rate: 0.1,
    total: 1000000,
    term: 12,
    need: 500000,
    ends: 10,
    lend: 0,
  },
];

export const DebtInSale: FC<Props> = () => {
  const [data, setData] = useState(hardData);

  //const [originalData] = useState(hardData);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id" as const,
      },
      {
        Header: "Solicitante",
        accessor: "user_id" as const,
      },
      {
        Header: "Calif.",
        accessor: "score" as const,
      },
      {
        Header: "Tasa",
        accessor: "rate" as const,
      },
      {
        Header: "Monto",
        accessor: "total" as const,
      },
      {
        Header: "Plazo",
        accessor: "term" as const,
      },
      {
        Header: "Faltan",
        accessor: "need" as const,
      },
      {
        Header: "Restan",
        accessor: "ends" as const,
      },
      {
        Header: "Prestar",
        accessor: "lend" as const,
      },
    ],
    []
  );

  const [skipPageReset, setSkipPageReset] = React.useState(false);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    usePagination
  );

  return (
    <div>
      <Table<
        [
          "id",
          "user_id",
          "score",
          "rate",
          "total",
          "term",
          "need",
          "ends",
          "lend"
        ]
      >
        data={[
          {
            id: "1",
            user_id: "Armando",
            score: "100",
            rate: "10",
            total: "10000",
            term: "12",
            need: "5000",
            ends: "12",
            lend: "Name",
          },
          {
            id: "2",
            user_id: "Fernando",
            score: "100",
            rate: "10",
            total: "10000",
            term: "12",
            need: "5000",
            ends: "12",
            lend: "Name",
          },
        ]}
        columns={[
          { key: "id", title: "ID" },
          { key: "user_id", title: "Solicitante" },
          { key: "score", title: "Calif." },
          { key: "rate", title: "10" },
          { key: "total", title: "Monto" },
          { key: "term", title: "Periodo" },
          { key: "need", title: "Faltan" },
          { key: "ends", title: "Termina" },
          { key: "lend", title: "Prestar" },
        ]}
        renderCell={(value) => {
          return <div>{value + 1}</div>;
        }}
      />
      <div>Deuda en venta</div>
      <table
        {...getTableProps()}
        style={{
          backgroundColor: "lightgray",
          borderSpacing: 0,
          borderCollapse: "collapse",
        }}
      >
        <thead style={{}}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    color: "dimgray",
                    fontWeight: "bold",
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
