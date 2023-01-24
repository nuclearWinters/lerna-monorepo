import React, { FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay/hooks";
import dayjs from "dayjs";
import { baseLoanRowCell, baseLoanRowContainer } from "./LoanRow.css";
import { LoginRowRefetchQuery } from "./__generated__/LoginRowRefetchQuery.graphql";
import { LoginRow_login$key } from "./__generated__/LoginRow_login.graphql";
import { Languages } from "screens/__generated__/SettingsMutation.graphql";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";

const loginRowRefetchableFragment = graphql`
  fragment LoginRow_login on Login
  @refetchable(queryName: "LoginRowRefetchQuery") {
    applicationName
    time
    address
  }
`;

type Props = {
  login: LoginRow_login$key;
  language: Languages;
};

export const LoginRow: FC<Props> = ({ login, language }) => {
  const [data] = useRefetchableFragment<
    LoginRowRefetchQuery,
    LoginRow_login$key
  >(loginRowRefetchableFragment, login);

  return (
    <div className={baseLoanRowContainer}>
      <div className={baseLoanRowCell}>{data.applicationName}</div>
      <div className={baseLoanRowCell}>
        {dayjs(data.time)
          .locale(language === "ES" ? es : en)
          .format(
            language === "ES"
              ? "D [de] MMMM [del] YYYY [a las] h:mm a"
              : "D MMMM[,] YYYY [at] h:mm a"
          )}
      </div>
      <div className={baseLoanRowCell}>{data.address}</div>
    </div>
  );
};
