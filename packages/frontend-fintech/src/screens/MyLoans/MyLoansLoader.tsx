import { ErrorBoundaryLoader } from "../../components/ErrorBoundaryLoader";
import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";

export const MyLoansLoader = () => {
  const { page, query, authQuery } = useLoaderData() as any;
  const navigate = useNavigate();
  return (
    <Suspense fallback={null}>
      <Await resolve={page} errorElement={<div />}>
        {(data) => {
          const { default: Component } = data;
          return (
            <ErrorBoundaryLoader navigate={navigate}>
              <Component query={query} authQuery={authQuery} />
            </ErrorBoundaryLoader>
          );
        }}
      </Await>
    </Suspense>
  );
};
