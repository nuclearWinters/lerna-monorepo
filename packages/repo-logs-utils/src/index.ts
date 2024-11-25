import { CloudWatchLogsClient, CreateLogGroupCommand, CreateLogStreamCommand, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { AWS_MAIN_KEY, AWS_MAIN_SECRET, AWS_REGION } from "./config.ts";
import { IS_PRODUCTION } from "@repo/utils";

const client = new CloudWatchLogsClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_MAIN_KEY,
    secretAccessKey: AWS_MAIN_SECRET,
  },
});

export const createGroupsAndStreams = async ({
  logGroupName,
  logStreamName,
}: {
  logGroupName: string;
  logStreamName: string;
}) => {
  const groupCommand = new CreateLogGroupCommand({ logGroupName });
  return client
    .send(groupCommand)
    .then(() => {
      const streamCommand = new CreateLogStreamCommand({
        logGroupName,
        logStreamName,
      });
      return client.send(streamCommand);
    })
    .catch(() => {
      const streamCommand = new CreateLogStreamCommand({
        logGroupName,
        logStreamName,
      });
      return client.send(streamCommand);
    })
    .finally(() => {
      return;
    });
};

export const logErr = async ({
  logGroupName,
  logStreamName,
  message,
}: {
  logGroupName: string;
  logStreamName: string;
  message: string;
}) => {
  try {
    if (!IS_PRODUCTION) {
      console.log(`${logGroupName}:${logStreamName}: ${message}`);
      return;
    }
    const command = new PutLogEventsCommand({
      logEvents: [
        {
          message: message,
          timestamp: new Date().getTime(),
        },
      ],
      logGroupName,
      logStreamName,
    });
    return (await client.send(command)).nextSequenceToken;
  } catch {
    await createGroupsAndStreams({ logGroupName, logStreamName });
    const command = new PutLogEventsCommand({
      logEvents: [
        {
          message: message,
          timestamp: new Date().getTime(),
        },
      ],
      logGroupName,
      logStreamName,
    });
    return (await client.send(command)).nextSequenceToken;
  }
};
