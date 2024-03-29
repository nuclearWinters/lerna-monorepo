import React, { FC } from "react";
import {
  graphql,
  useMutation,
  useRefetchableFragment,
} from "react-relay/hooks";
import dayjs from "dayjs";
import {
  baseLoanRowCell,
  baseLoanRowClipboard,
  baseLoanRowContainer,
  baseLoanRowIcon,
} from "./LoanRow.css";
import { SessionRow_session$key } from "./__generated__/SessionRow_session.graphql";
import { SessionRowRefetchQuery } from "./__generated__/SessionRowRefetchQuery.graphql";
import { SessionRowRevokeSessionMutation } from "./__generated__/SessionRowRevokeSessionMutation.graphql";
import { FaTrashAlt } from "react-icons/fa";
import { Spinner } from "./Spinner";

const loginRowRefetchableFragment = graphql`
  fragment SessionRow_session on Session
  @refetchable(queryName: "SessionRowRefetchQuery") {
    id
    applicationName
    type
    deviceName
    address
    lastTimeAccessed
  }
`;

type Props = {
  session: SessionRow_session$key;
};

export const SessionRow: FC<Props> = ({ session }) => {
  const [data] = useRefetchableFragment<
    SessionRowRefetchQuery,
    SessionRow_session$key
  >(loginRowRefetchableFragment, session);

  const [commitRevokeSession, isInFlightRevokeSession] =
    useMutation<SessionRowRevokeSessionMutation>(graphql`
      mutation SessionRowRevokeSessionMutation($input: RevokeSessionInput!) {
        revokeSession(input: $input) {
          error
          shouldReloadBrowser
          session {
            id
            expirationDate
          }
        }
      }
    `);

  return (
    <div className={baseLoanRowContainer}>
      <div className={baseLoanRowCell}>{data.applicationName}</div>
      <div className={baseLoanRowCell}>{data.type}</div>
      <div className={baseLoanRowCell}>{data.deviceName}</div>
      <div className={baseLoanRowCell}>
        {dayjs(data.lastTimeAccessed).format("DD[/]MM[/]YYYY h:mm a")}
      </div>
      <div className={baseLoanRowCell}>{data.address}</div>
      {isInFlightRevokeSession ? (
        <Spinner />
      ) : (
        <div
          className={baseLoanRowClipboard}
          onClick={() => {
            commitRevokeSession({
              variables: { input: { sessionId: data.id } },
              onCompleted: (data) => {
                if (data.revokeSession.shouldReloadBrowser) {
                  window.location.reload();
                }
              },
            });
          }}
        >
          <FaTrashAlt className={baseLoanRowIcon} />
        </div>
      )}
    </div>
  );
};
