import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import {
  GraphQLScalarType,
  Kind,
  parse,
  subscribe,
  execute,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";
import { DecodeJWT } from "./types";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { ObjMap } from "graphql/jsutils/ObjMap";

export const jwt = {
  decode: (token: string): string | DecodeJWT | null => {
    const decoded = jsonwebtoken.decode(token);
    return decoded as string | DecodeJWT | null;
  },
  verify: (token: string, password: string): DecodeJWT | undefined => {
    const decoded = jsonwebtoken.verify(token, password);
    return decoded as DecodeJWT | undefined;
  },
  sign: (
    data: {
      id: string;
      isBorrower: boolean;
      isLender: boolean;
      isSupport: boolean;
      refreshTokenExpireTime: number;
      exp: number;
    },
    secret: string,
    options?: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};

export const base64 = (i: string): string => {
  return Buffer.from("arrayconnection:" + i, "utf8").toString("base64");
};

export const unbase64 = (i: string): string => {
  return Buffer.from(i, "base64").toString("utf8").split(":")[1];
};

export const DateScalarType = new GraphQLScalarType({
  name: "Date",
  serialize: (value) => {
    if (value instanceof Date) {
      return value.getTime();
    }
  },
  parseValue: (value) => {
    if (typeof value === "number") {
      return new Date(value);
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export function isAsyncIterable<T>(val: unknown): val is AsyncIterable<T> {
  return typeof Object(val)[Symbol.asyncIterator] === "function";
}

export function print(msg: {
  event: "next" | "complete";
  data: ExecutionResult<ObjMap<unknown>, ObjMap<unknown>> | null;
}): string {
  let str = `event: ${msg.event}\ndata:`;
  if (msg.data) {
    str += " ";
    str += JSON.stringify(msg.data);
  }
  str += "\n\n";
  return str;
}

export const createHandler = ({
  schema,
  context,
  queryMap,
  dataDrivenDependencies,
}: {
  schema: GraphQLSchema;
  context: (
    req: Http2ServerRequest,
    res: Http2ServerResponse
  ) => Promise<Record<string, unknown>>;
  queryMap: string[][];
  dataDrivenDependencies?: {
    reset(): void;
    getModules(): unknown[];
  };
}): ((req: Http2ServerRequest, res: Http2ServerResponse) => Promise<void>) => {
  return async (req: Http2ServerRequest, res: Http2ServerResponse) => {
    const getBody = () =>
      new Promise<{
        extensions?: { doc_id: string };
        variables?: Record<string, unknown>;
      }>((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.once("error", reject);
        req.once("end", () => {
          req.off("error", reject);
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({});
          }
        });
      });
    const body = await getBody();
    const { extensions, variables } = body;
    const doc_id = extensions?.doc_id;
    const query = queryMap.find((query) => query[0] === doc_id)?.[1];
    if (!query) {
      res.writeHead(404);
      res.end();
      return;
    }
    const contextValue = await context(req, res);
    const document = parse(query);
    const definitionNode = document.definitions[0];
    const operationName =
      "operation" in definitionNode ? definitionNode.operation : null;
    const result =
      operationName === "subscription"
        ? await subscribe({
            schema,
            document,
            variableValues: variables,
            contextValue,
          })
        : await execute({
            schema,
            document,
            variableValues: variables,
            contextValue,
          });
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    if (isAsyncIterable(result)) {
      for await (const value of result) {
        const data = print({
          event: "next",
          data: dataDrivenDependencies
            ? {
                ...value,
                extensions: { modules: dataDrivenDependencies.getModules() },
              }
            : value,
        });
        res.write(data);
      }
    } else {
      const data = print({
        event: "next",
        data: dataDrivenDependencies
          ? {
              ...result,
              extensions: { modules: dataDrivenDependencies.getModules() },
            }
          : result,
      });
      res.write(data);
    }
    const data = print({
      event: "complete",
      data: null,
    });
    res.write(data);
    res.end();
  };
};
