import { ErrorBoundaryLoader } from "components/ErrorBoundaryLoader";
import React, { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";

export const MyInvestmentsLoader = () => {
  const { page, query } = useLoaderData() as any;
  const navigate = useNavigate();
  return (
    <Suspense fallback={null}>
      <Await resolve={page} errorElement={<div />}>
        {(data) => {
          const { default: Component } = data;
          return (
            <ErrorBoundaryLoader navigate={navigate}>
              <Component query={query} />
            </ErrorBoundaryLoader>
          );
        }}
      </Await>
    </Suspense>
  );
};
