import { Outlet, useLoaderData, useNavigate, useLocation } from "react-router";
import { Header } from "../../components/Header";
import React, { FC, Suspense } from "react";
import { Spinner } from "components/Spinner";
import { Sider } from "components/Sider";
import { baseApp } from "App";
import * as stylex from "@stylexjs/stylex";
import { baseHeader, baseRoutes, baseRoutesContent, baseSider } from "Routes";
import { ErrorBoundaryFallback } from "components/ErrorBoundaryFallback";
import { HeaderNotLogged } from "components/HeaderNotLogged";
import { SiderNotLogged } from "components/SiderNotLogged";

export const HeaderAuth: FC = () => {
  const { query } = useLoaderData() as any;
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
          <ErrorBoundaryFallback
            navigate={navigate}
            fallback={<SiderNotLogged />}
            pathname={pathname}
          >
            <Sider query={query} />
          </ErrorBoundaryFallback>
        </Suspense>
        <Suspense
          fallback={
            <div {...stylex.props(baseHeader.base, baseHeader.fallback)}>
              <Spinner />
            </div>
          }
        >
          <ErrorBoundaryFallback
            navigate={navigate}
            fallback={<HeaderNotLogged />}
            pathname={pathname}
          >
            <Header query={query} />
          </ErrorBoundaryFallback>
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
