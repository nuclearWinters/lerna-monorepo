import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
} from "graphql";
import { Context, ADD_LEND } from "../types";
import { MXNScalarType } from "../Nodes";

interface Input {
  lends: {
    quantity: number;
    borrower_id: string;
    loan_gid: string;
    goal: number;
    term: number;
    ROI: number;
  }[];
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const GraphQLLendList = new GraphQLInputObjectType({
  name: "LendList",
  fields: {
    loan_gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
    },
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    goal: {
      type: new GraphQLNonNull(MXNScalarType),
    },
    term: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

export const AddLendsMutation = mutationWithClientMutationId({
  name: "AddLends",
  description:
    "Envía una lista de prestamos: recibe una lista con deudas actualizadas y un usuario actualizado.",
  inputFields: {
    lends: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLendList))
      ),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
  },
  mutateAndGetPayload: async (
    { lends: newLends }: Input,
    { validAccessToken, id, ch }: Context
  ): Promise<Payload> => {
    try {
      if (!id || !validAccessToken) {
        throw new Error("No valid access token.");
      }
      //Crear lista de elementos con datos en el input
      const docs = newLends.map(
        ({ loan_gid, quantity, borrower_id, goal, term, ROI }) => {
          const id_loan = fromGlobalId(loan_gid).id;
          //Tasa efectiva mensual
          const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
          return {
            id_lender: id,
            id_borrower: borrower_id,
            quantity,
            id_loan,
            goal,
            raised: 0,
            term,
            ROI,
            TEM,
          };
        }
      );
      for (const lend of docs) {
        ch.sendToQueue(ADD_LEND, Buffer.from(JSON.stringify(lend)));
      }
      return { validAccessToken, error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
