import { FC } from "react";
import {
  graphql,
  useMutation,
  useRefetchableFragment,
} from "react-relay/hooks";
import dayjs from "dayjs";
import { SessionRow_session$key } from "./__generated__/SessionRow_session.graphql";
import { SessionRowRefetchQuery } from "./__generated__/SessionRowRefetchQuery.graphql";
import { SessionRowRevokeSessionMutation } from "./__generated__/SessionRowRevokeSessionMutation.graphql";
import { FaTrashAlt } from "@react-icons/all-files/fa/FaTrashAlt";
import { Spinner } from "./Spinner";
import * as stylex from "@stylexjs/stylex";

export const baseLoanRowIcon = stylex.create({
  base: {
    fontSize: "18px",
    color: "rgb(255,90,96)",
  },
});

export const baseLoanRowCell = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
  },
});

export const baseLoanRowClipboard = stylex.create({
  base: {
    flex: "1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "white",
    padding: "10px 0px",
    textAlign: "center",
    color: "#333",
    cursor: "pointer",
  },
});

export const baseLoanRowContainer = stylex.create({
  base: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
  },
});

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
    <div {...stylex.props(baseLoanRowContainer.base)}>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.applicationName}</div>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.type}</div>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.deviceName}</div>
      <div {...stylex.props(baseLoanRowCell.base)}>
        {dayjs(data.lastTimeAccessed).format("DD[/]MM[/]YYYY h:mm a")}
      </div>
      <div {...stylex.props(baseLoanRowCell.base)}>{data.address}</div>
      {isInFlightRevokeSession ? (
        <Spinner />
      ) : (
        <div
          {...stylex.props(baseLoanRowClipboard.base)}
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
          <FaTrashAlt {...stylex.props(baseLoanRowIcon.base)} />
        </div>
      )}
    </div>
  );
};
