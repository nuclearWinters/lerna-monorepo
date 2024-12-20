/**
 * @generated SignedSource<<cdc72779054d474ba2bea1d69a73cc19>>
 * @relayHash 42158b2d4898c10429bee6ac923b8bbc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 42158b2d4898c10429bee6ac923b8bbc

import { ConcreteRequest } from 'relay-runtime';
export type Languages = "EN" | "ES" | "%future added value";
export type UpdateUserInput = {
  CURP: string;
  RFC: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  clabe: string;
  clientMutationId?: string | null | undefined;
  email: string;
  language: Languages;
  mobile: string;
  name: string;
};
export type SettingsMutation$variables = {
  input: UpdateUserInput;
};
export type SettingsMutation$data = {
  readonly updateUser: {
    readonly authUser: {
      readonly CURP: string;
      readonly RFC: string;
      readonly apellidoMaterno: string;
      readonly apellidoPaterno: string;
      readonly clabe: string;
      readonly email: string;
      readonly id: string;
      readonly language: Languages;
      readonly mobile: string;
      readonly name: string;
    };
    readonly error: string;
  };
};
export type SettingsMutation = {
  response: SettingsMutation$data;
  variables: SettingsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateUserPayload",
    "kind": "LinkedField",
    "name": "updateUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "error",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoPaterno",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoMaterno",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "RFC",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "CURP",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clabe",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mobile",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "language",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "42158b2d4898c10429bee6ac923b8bbc\r",
    "metadata": {},
    "name": "SettingsMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "f6458d79bacdb67678af191f522a5d58";

export default node;
