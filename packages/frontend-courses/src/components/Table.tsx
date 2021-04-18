import React, { PropsWithChildren } from "react";

type MapColumns<T> = {
  [K in keyof T]: { key: T[K]; title: string };
};

type NeededUnionType<T extends string[]> = T[number];

interface Props<T extends string[]> {
  data: Record<NeededUnionType<T>, string>[];
  columns: MapColumns<T>;
  renderCell?: (value: string) => JSX.Element;
}

export const Table = <T extends string[]>({
  data,
  columns,
  renderCell,
}: PropsWithChildren<Props<T>>) => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {columns.map((column) => (
          <div key={column.title} style={{ flex: 1 }}>
            {column.title}
          </div>
        ))}
      </div>
      <div>
        {data.map((row: any) => (
          <div key={row.id} style={{ display: "flex", flexDirection: "row" }}>
            {Object.values(row).map((cell, i) => (
              <div key={i} style={{ flex: 1 }}>
                {renderCell ? renderCell(cell as string) : (cell as string)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
