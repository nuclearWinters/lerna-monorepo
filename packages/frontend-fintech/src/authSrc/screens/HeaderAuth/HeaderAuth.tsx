import { Header } from "../../../components/Header";
import { FC, Suspense, ReactNode } from "react";
import { Spinner } from "../../../components/Spinner";
import * as stylex from "@stylexjs/stylex";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { utilsFintechQuery } from "../../../fintechSrc/__generated__/utilsFintechQuery.graphql";
import { Sider } from "../../../components/Sider";
import {
  EntryPointPrepared,
  EntryPointProps,
} from "../../../react-router-entrypoints/types";

/*type iQueries = {
  fintechQuery: AccountQueriesQuery;
  authQuery: utilsAuthQuery;
};

type iExtraProps = {
  test: string;
};

interface iEntryPointProps<TPreloadedQueries, TRuntimeProps = object> {
  readonly props: TRuntimeProps & { routeData: RouteData };
  readonly prepared: PreloadedQueries<TPreloadedQueries>;
}

type iProps = EntryPointProps<iQueries, iExtraProps>;

const Test: FC<iProps> = (props) => {
  return <div>{props.props.test}</div>;
};

export interface ThinQueryParams<T> {
  readonly parameters: string;
  readonly variables: number;
  readonly options?: T;
  readonly environment: "auth" | "fintech";
}

export type ThinQueryParamsObject<TPreloadedQueries> = {
  [K in keyof TPreloadedQueries]: ThinQueryParams<TPreloadedQueries[K]>;
};

export interface PreloadProps<TPreloadedQueries> {
  readonly queries?: ThinQueryParamsObject<TPreloadedQueries> | undefined;
}

type EntryPoint<iQueries, iProps> = {
  root: Resource<FC<iEntryPointProps<iQueries, iProps>>>;
  getPreloadedProps: () => PreloadProps<iQueries>;
};

type CustomSimpleEntryPoint<Queries, Props> = EntryPoint<Queries, Props>;

export const accountEntrypointTest: CustomSimpleEntryPoint<iQueries, { children: ReactNode }> = {
  root: JSResourceTyped("Account", () => import("../Account/Account")),
  getPreloadedProps: () => {
    return {
      queries: {
        fintechQuery: {
          parameters: "test1",
          variables: 1,
          environment: "auth",
        },
        authQuery: {
          parameters: "test2",
          variables: 2,
          environment: "auth",
        },
      },
    };
  },
};

test.getPreloadedProps();*/

export type Queries = {
  authQuery: utilsAuthQuery;
  fintechQuery: utilsFintechQuery;
};

export type PreparedProps = EntryPointPrepared<Queries>;

export type Props = EntryPointProps<Queries, { children: ReactNode }>;

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

export const HeaderAuth: FC<Props> = (props) => {
  //console.log(props.prepared.authQuery.dispose);
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
            authQuery={props.prepared.authQuery}
            fintechQuery={props.prepared.fintechQuery}
          />
        </Suspense>
        <Suspense
          fallback={
            <div {...stylex.props(baseHeader.base)}>
              <Spinner />
            </div>
          }
        >
          <Header query={props.prepared.authQuery} />
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
