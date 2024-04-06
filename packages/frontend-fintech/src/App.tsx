import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import { RouterProvider } from "react-router";
import { router } from "./router";
import * as stylex from "@stylexjs/stylex";
import { Languages } from "./utils";

export const baseApp = stylex.create({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(248,248,248)",
  },
});

export const LanguageContext = createContext<
  [Languages, Dispatch<SetStateAction<Languages>>]
>([navigator.language.includes("es") ? "ES" : "EN", () => {}]);

export const App: FC = () => {
  const [language, setLanguage] = useState<Languages>(
    navigator.language.includes("es") ? "ES" : "EN"
  );
  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <RouterProvider router={router} />
      </RelayEnvironmentProvider>
    </LanguageContext.Provider>
  );
};
