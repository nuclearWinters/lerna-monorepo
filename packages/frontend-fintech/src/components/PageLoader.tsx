import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Spinner } from "./Spinner";
import * as stylex from "@stylexjs/stylex";

const loading = stylex.create({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    backgroundColor: "rgb(248, 248, 248)",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "3",
  },
});

export const PageLoader = () => {
  const { page, query, authQuery } = useLoaderData() as any;
  return (
    <Suspense
      fallback={
        <div {...stylex.props(loading.base)}>
          <Spinner />
        </div>
      }
    >
      <Await
        resolve={page}
        errorElement={<div {...stylex.props(loading.base)}>Error</div>}
      >
        {(data) => {
          const { default: Component } = data;
          return <Component query={query} authQuery={authQuery} />;
        }}
      </Await>
    </Suspense>
  );
};
