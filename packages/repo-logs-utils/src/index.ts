import { CloudWatchLogs, AWSError } from "aws-sdk";
import { AWS_MAIN_KEY, AWS_MAIN_SECRET, AWS_REGION } from "./config";

const cloudwatchLogs = new CloudWatchLogs({
  accessKeyId: AWS_MAIN_KEY,
  secretAccessKey: AWS_MAIN_SECRET,
  region: AWS_REGION,
});

const params = {
  logGroupName: "AuthLogGroup",
  logStreamName: "AuthStream",
};

cloudwatchLogs.createLogGroup(params, (err) => {
  if (err) console.log("Error", err);
  else console.log("Log group created successfully");
});

export const errorFunction = async ({
  logGroupName,
  logStreamName,
  errorMessage,
}: {
  logGroupName: string;
  logStreamName: string;
  errorMessage: string;
}) => {
  try {
    await cloudwatchLogs
      .createLogStream({
        logGroupName,
        logStreamName,
      })
      .promise();
  } catch (e) {
    const error = e as AWSError;
    if (error.code === "ResourceNotFoundException") {
      await cloudwatchLogs
        .createLogGroup({
          logGroupName,
        })
        .promise();
    }
  }
  return (
    await cloudwatchLogs
      .putLogEvents({
        logEvents: [
          {
            message: errorMessage,
            timestamp: new Date().getTime(),
          },
        ],
        logGroupName: logGroupName,
        logStreamName: logStreamName,
      })
      .promise()
  ).nextSequenceToken;
};

// can use above function like this when you get the error
//await logError({
//  logGroupName: "your group name",
//  logStreamName: `${new Date().getTime()}`,
//  errMessage: err.message,
//});
