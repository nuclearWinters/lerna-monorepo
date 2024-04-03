import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

export const AddLoanLoader = () => {
  const { page } = useLoaderData() as any;
  return (
    <Suspense fallback={null}>
      <Await resolve={page} errorElement={<div />}>
        {(data) => {
          const { default: Component } = data;
          return <Component />;
        }}
      </Await>
    </Suspense>
  );
};
