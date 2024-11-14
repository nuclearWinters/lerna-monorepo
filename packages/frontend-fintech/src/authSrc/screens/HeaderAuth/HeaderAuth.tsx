import { Header } from "../../../components/Header";
import { ReactNode, Suspense } from "react";
import { Spinner } from "../../../components/Spinner";
import * as stylex from "@stylexjs/stylex";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { utilsFintechQuery } from "../../../fintechSrc/__generated__/utilsFintechQuery.graphql";
import { Sider } from "../../../components/Sider";
import { EntryPointComponent } from "react-relay";
import { OperationType } from "relay-runtime";

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

export const baseMain = stylex.create({
  base: {
    backgroundColor: "rgb(248,248,248)",
    flex: "1",
    display: "flex",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "3",
    overflow: "scroll",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: utilsFintechQuery;
  authQuery: utilsAuthQuery;
}

export const HeaderAuth: EntryPointComponent<
  Queries,
  Record<string, undefined>,
  { children: ReactNode }
> = (props) => {
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
          <Sider
            authQuery={props.queries.authQuery}
            fintechQuery={props.queries.fintechQuery}
          />
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
        <Suspense
          fallback={
            <div {...stylex.props(baseMain.base)}>
              <Spinner />
            </div>
          }
        >
          {props.props.children}
        </Suspense>
      </div>
    </>
  );
};

export default HeaderAuth;
