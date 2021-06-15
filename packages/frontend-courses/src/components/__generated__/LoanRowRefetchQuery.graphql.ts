/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanRowRefetchQueryVariables = {
  id: string;
};
export type LoanRowRefetchQueryResponse = {
  readonly node: {
    readonly " $fragmentRefs": FragmentRefs<"LoanRow_loan">;
  } | null;
};
export type LoanRowRefetchQuery = {
  readonly response: LoanRowRefetchQueryResponse;
  readonly variables: LoanRowRefetchQueryVariables;
};

/*
query LoanRowRefetchQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ...LoanRow_loan
    id
  }
}

fragment LoanRow_loan on Loan {
  id
  _id_user
  score
  ROI
  goal
  term
  raised
  expiry
  status
  scheduledPayments {
    amortize
    status
    scheduledDate
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      } as any,
    ],
    v1 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "status",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "LoanRowRefetchQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
          selections: [
            {
              args: null,
              kind: "FragmentSpread",
              name: "LoanRow_loan",
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "LoanRowRefetchQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "__typename",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "id",
              storageKey: null,
            },
            {
              kind: "InlineFragment",
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "_id_user",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "score",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "ROI",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "goal",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "term",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "raised",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "expiry",
                  storageKey: null,
                },
                v2 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ScheduledPayments",
                  kind: "LinkedField",
                  name: "scheduledPayments",
                  plural: true,
                  selections: [
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "amortize",
                      storageKey: null,
                    },
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "scheduledDate",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
              ],
              type: "Loan",
              abstractKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "9d38ae3d457fc3a1527322aa75ef3399",
      id: null,
      metadata: {},
      name: "LoanRowRefetchQuery",
      operationKind: "query",
      text: "query LoanRowRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...LoanRow_loan\n    id\n  }\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  _id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "02ecb10e18a8b0a5924d6890b3fd7400";
export default node;
