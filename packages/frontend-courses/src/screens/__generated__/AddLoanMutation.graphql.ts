/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLoanInput = {
  clientMutationId?: string | null;
  refreshToken: string;
  user_gid: string;
  term: number;
  goal: string;
};
export type AddLoanMutationVariables = {
  input: AddLoanInput;
};
export type AddLoanMutationResponse = {
  readonly addLoan: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly loan: {
      readonly id: string;
      readonly _id_user: string;
      readonly score: string;
      readonly ROI: number;
      readonly goal: string;
      readonly term: number;
      readonly raised: string;
      readonly expiry: number;
    } | null;
  };
};
export type AddLoanMutation = {
  readonly response: AddLoanMutationResponse;
  readonly variables: AddLoanMutationVariables;
};

/*
mutation AddLoanMutation(
  $input: AddLoanInput!
) {
  addLoan(input: $input) {
    error
    validAccessToken
    loan {
      id
      _id_user
      score
      ROI
      goal
      term
      raised
      expiry
    }
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
        concreteType: "AddLoanPayload",
        kind: "LinkedField",
        name: "addLoan",
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
          {
            alias: null,
            args: null,
            concreteType: "Loan",
            kind: "LinkedField",
            name: "loan",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "id",
                storageKey: null,
              },
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
            ],
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
      name: "AddLoanMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "AddLoanMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "06f2d04082c1edc7249cec36fc0f76b5",
      id: null,
      metadata: {},
      name: "AddLoanMutation",
      operationKind: "mutation",
      text: "mutation AddLoanMutation(\n  $input: AddLoanInput!\n) {\n  addLoan(input: $input) {\n    error\n    validAccessToken\n    loan {\n      id\n      _id_user\n      score\n      ROI\n      goal\n      term\n      raised\n      expiry\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "63fbf06f7973db496f67aabfb77d6a7e";
export default node;
