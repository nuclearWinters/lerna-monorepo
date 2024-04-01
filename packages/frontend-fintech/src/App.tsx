import React, { createContext, FC, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import { Languages } from "__generated__/AppUserQuery.graphql";
import { RouterProvider } from "react-router";
import { router } from "Routes";
import * as stylex from "@stylexjs/stylex";

export const baseApp = stylex.create({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(248,248,248)",
  },
});

export const LanguageContext = createContext<
  [Languages, React.Dispatch<React.SetStateAction<Languages>>]
>(["EN", () => {}]);

export const App: FC = () => {
  const [language, setLanguage] = useState<Languages>("EN");
  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <RouterProvider router={router} />
      </RelayEnvironmentProvider>
    </LanguageContext.Provider>
  );
};
