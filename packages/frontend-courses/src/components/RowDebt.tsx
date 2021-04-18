import React, { FC } from "react";
import { Row } from "react-table";

interface Props {
  row: Row<{
    id: string;
    user_id: string;
    score: number;
    rate: number;
    total: number;
    term: number;
    need: number;
    ends: number;
    lend: number;
  }>;
}

export const RowDebt: FC<Props> = ({ row }) => {
  return (
    <tr {...row.getRowProps()}>
      {row.cells.map((cell) => {
        switch (cell.column.id) {
          case "lend":
            return (
              <td
                {...cell.getCellProps()}
                style={{
                  padding: "10px",
                  backgroundColor: "papayawhip",
                }}
              >
                <div>
                  $
                  <input value={cell.value === 0 ? "" : cell.value} />
                </div>
              </td>
            );
          default:
            return (
              <td
                {...cell.getCellProps()}
                style={{
                  padding: "10px",
                  backgroundColor: "papayawhip",
                }}
              >
                {cell.render("Cell")}
              </td>
            );
        }
      })}
    </tr>
  );
};
