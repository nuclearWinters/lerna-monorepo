import * as stylex from "@stylexjs/stylex";
import { type FC, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { RelayEnvironmentAuth } from "./RelayEnvironment";
import { MyRouter } from "./router";
import { LanguageContext, type Languages } from "./utils";

export const baseApp = stylex.create({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(248,248,248)",
  },
});

export const App: FC = () => {
  const [language, setLanguage] = useState<Languages>(navigator.language.includes("es") ? "ES" : "EN");
  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <RelayEnvironmentProvider environment={RelayEnvironmentAuth}>
        <MyRouter />
      </RelayEnvironmentProvider>
    </LanguageContext.Provider>
  );
};
