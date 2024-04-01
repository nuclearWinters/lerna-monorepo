import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

export const AddInvestmentsLoader = () => {
  const { page, query, authQuery } = useLoaderData() as any;
  return (
    <Suspense fallback={null}>
      <Await resolve={page} errorElement={<div />}>
        {(data) => {
          const { default: Component } = data;
          return <Component query={query} authQuery={authQuery} />;
        }}
      </Await>
    </Suspense>
  );
};
