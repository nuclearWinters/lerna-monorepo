/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UpdateUserInput = {
  clientMutationId?: string | null;
  user_gid: string;
  name?: string | null;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  RFC?: string | null;
  CURP?: string | null;
  clabe?: string | null;
  mobile?: string | null;
};
export type ProfileMutationVariables = {
  input: UpdateUserInput;
};
export type ProfileMutationResponse = {
  readonly updateUser: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly user: {
      readonly name: string;
      readonly apellidoMaterno: string;
      readonly apellidoPaterno: string;
      readonly RFC: string;
      readonly CURP: string;
      readonly clabe: string;
      readonly mobile: string;
      readonly investments: ReadonlyArray<{
        readonly _id_loan: string;
        readonly quantity: number;
        readonly term: number;
        readonly ROI: number;
        readonly payments: number;
      }>;
      readonly accountAvailable: string;
    };
  };
};
export type ProfileMutation = {
  readonly response: ProfileMutationResponse;
  readonly variables: ProfileMutationVariables;
};

/*
mutation ProfileMutation(
  $input: UpdateUserInput!
) {
  updateUser(input: $input) {
    error
    validAccessToken
    user {
      name
      apellidoMaterno
      apellidoPaterno
      RFC
      CURP
      clabe
      mobile
      investments {
        _id_loan
        quantity
        term
        ROI
        payments
      }
      accountAvailable
      id
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
        kind: "Variable",
        name: "input",
        variableName: "input",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "error",
      storageKey: null,
    } as any,
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "validAccessToken",
      storageKey: null,
    } as any,
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    } as any,
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "apellidoMaterno",
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "apellidoPaterno",
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "RFC",
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "CURP",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "clabe",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "mobile",
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      concreteType: "InvestmentsUser",
      kind: "LinkedField",
      name: "investments",
      plural: true,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "_id_loan",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "quantity",
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
          name: "ROI",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "payments",
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "accountAvailable",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "ProfileMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "UpdateUserPayload",
          kind: "LinkedField",
          name: "updateUser",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "user",
              plural: false,
              selections: [
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                v10 /*: any*/,
                v11 /*: any*/,
                v12 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "ProfileMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "UpdateUserPayload",
          kind: "LinkedField",
          name: "updateUser",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "user",
              plural: false,
              selections: [
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                v10 /*: any*/,
                v11 /*: any*/,
                v12 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "id",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "9f39849b5f4950bcfa2650068354ab0b",
      id: null,
      metadata: {},
      name: "ProfileMutation",
      operationKind: "mutation",
      text: "mutation ProfileMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    error\n    validAccessToken\n    user {\n      name\n      apellidoMaterno\n      apellidoPaterno\n      RFC\n      CURP\n      clabe\n      mobile\n      investments {\n        _id_loan\n        quantity\n        term\n        ROI\n        payments\n      }\n      accountAvailable\n      id\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "5721e6917c3eca0d909e5ed867d050af";
export default node;
