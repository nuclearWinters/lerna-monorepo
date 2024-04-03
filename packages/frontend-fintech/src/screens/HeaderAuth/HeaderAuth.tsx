import { Outlet, useLoaderData } from "react-router-dom";
import { Header } from "../../components/Header";
import { FC, Suspense } from "react";
import { Spinner } from "../../components/Spinner";
import { Sider } from "../../components/Sider";
import * as stylex from "@stylexjs/stylex";

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
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "126px 1fr",
    gridAutoRows: "60px 1fr",
  },
});

export const baseRoutesContent = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    backgroundColor: "rgb(248,248,248)",
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
  },
  fallback: {
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
  },
});

export const HeaderAuth: FC = () => {
  const { query } = useLoaderData() as any;
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
          <Sider query={query} />
        </Suspense>
        <Suspense
          fallback={
            <div {...stylex.props(baseHeader.base, baseHeader.fallback)}>
              <Spinner />
            </div>
          }
        >
          <Header query={query} />
        </Suspense>
        <Suspense
          fallback={
            <div {...stylex.props(baseApp.base)}>
              <Spinner />
            </div>
          }
        >
          <div {...stylex.props(baseRoutesContent.base)}>
            <Outlet />
          </div>
        </Suspense>
      </div>
    </>
  );
};
