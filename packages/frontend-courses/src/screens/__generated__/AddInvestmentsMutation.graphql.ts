/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLendsInput = {
  clientMutationId?: string | null;
  lender_gid: string;
  lends: Array<LendList>;
};
export type LendList = {
  loan_gid: string;
  quantity: string;
  borrower_id: string;
  term: number;
  goal: string;
  ROI: number;
};
export type AddInvestmentsMutationVariables = {
  input: AddLendsInput;
};
export type AddInvestmentsMutationResponse = {
  readonly addLends: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type AddInvestmentsMutation = {
  readonly response: AddInvestmentsMutationResponse;
  readonly variables: AddInvestmentsMutationVariables;
};

/*
mutation AddInvestmentsMutation(
  $input: AddLendsInput!
) {
  addLends(input: $input) {
    error
    validAccessToken
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "input",
      } as any,
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "input",
            variableName: "input",
          },
        ],
        concreteType: "AddLendsPayload",
        kind: "LinkedField",
        name: "addLends",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "error",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "validAccessToken",
            storageKey: null,
          },
        ],
        storageKey: null,
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "AddInvestmentsMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "AddInvestmentsMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "9aa08a809975ca556933bb1478d3013e",
      id: null,
      metadata: {},
      name: "AddInvestmentsMutation",
      operationKind: "mutation",
      text: "mutation AddInvestmentsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n    validAccessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "4e5cf9b355984b680017055078259249";
export default node;
