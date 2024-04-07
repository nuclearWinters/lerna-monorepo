import { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseTableColumnName = stylex.create({
  base: {
    textAlign: "center",
    color: "rgb(62,62,62)",
    padding: "4px 0px",
  },
});

export const TableColumnName: FC<{ children: ReactNode; colspan?: number }> = ({
  children,
  colspan,
}) => {
  return (
    <th colSpan={colspan} {...stylex.props(baseTableColumnName.base)}>
      {children}
    </th>
  );
};
