import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";
import { FC, Suspense } from "react";
import { Spinner } from "../../components/Spinner";
import { Sider } from "../../components/Sider";
import * as stylex from "@stylexjs/stylex";
import { SimpleEntryPointProps } from "@loop-payments/react-router-relay";
import { utilsQuery } from "../../__generated__/utilsQuery.graphql";

type Props = SimpleEntryPointProps<{
  authQuery: utilsQuery;
}>;

export const baseApp = stylex.create({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(248,248,248)",
  },
});

export const baseRoutes = stylex.create({
  base: {
    height: "100vh",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    gridAutoRows: "60px 1fr",
  },
});

export const baseRoutesContent = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    overflow: "scroll",
    backgroundColor: "rgb(248, 248, 248)",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "3",
  },
});

export const baseHeader = stylex.create({
  base: {
    gridColumnStart: "2",
    gridColumnEnd: "2",
    gridRowStart: "1",
    gridRowEnd: "2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const baseSider = stylex.create({
  base: {
    gridRowStart: "1",
    gridRowEnd: "3",
    gridColumnStart: "1",
    gridColumnEnd: "1",
    display: "flex",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const HeaderAuth: FC<Props> = (props) => {
  return (
    <>
      <div {...stylex.props(baseRoutes.base)}>
        <Suspense
          fallback={
            <div {...stylex.props(baseSider.base)}>
              <Spinner />
            </div>
          }
        >
          <Sider query={props.queries.authQuery} />
        </Suspense>
        <Suspense
          fallback={
            <div {...stylex.props(baseHeader.base)}>
              <Spinner />
            </div>
          }
        >
          <Header query={props.queries.authQuery} />
        </Suspense>
        <Outlet />
      </div>
    </>
  );
};

export default HeaderAuth;
