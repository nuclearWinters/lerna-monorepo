import React, { FC } from "react";
import { graphql, useRefetchableFragment } from "react-relay/hooks";
import dayjs from "dayjs";
import { LoginRowRefetchQuery } from "./__generated__/LoginRowRefetchQuery.graphql";
import { LoginRow_login$key } from "./__generated__/LoginRow_login.graphql";
import es from "dayjs/locale/es";
import en from "dayjs/locale/en";
import { Languages } from "__generated__/AppUserQuery.graphql";
import { baseLoanRowCell, baseLoanRowContainer } from "./LoanRow";
import * as stylex from "@stylexjs/stylex";

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
    <div {...stylex.props(baseLoanRowContainer.base)}>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.applicationName}</div>
      <div {...stylex.props(baseLoanRowCell.base)}>
        {dayjs(data.time)
          .locale(language === "ES" ? es : en)
          .format(
            language === "ES"
              ? "D [de] MMMM [del] YYYY [a las] h:mm a"
              : "D MMMM[,] YYYY [at] h:mm a"
          )}
      </div>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.address}</div>
    </div>
  );
};
