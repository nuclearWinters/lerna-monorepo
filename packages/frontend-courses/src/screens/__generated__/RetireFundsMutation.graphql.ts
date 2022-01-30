/**
 * @generated SignedSource<<c3aff1f7afc387c7e6501f165c72690f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null;
  user_gid: string;
  quantity: string;
};
export type RetireFundsMutation$variables = {
  input: AddFundsInput;
};
export type RetireFundsMutationVariables = RetireFundsMutation$variables;
export type RetireFundsMutation$data = {
  readonly addFunds: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type RetireFundsMutationResponse = RetireFundsMutation$data;
export type RetireFundsMutation = {
  variables: RetireFundsMutationVariables;
  response: RetireFundsMutation$data;
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
    "concreteType": "AddFundsPayload",
    "kind": "LinkedField",
    "name": "addFunds",
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
        "kind": "ScalarField",
        "name": "validAccessToken",
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
    "name": "RetireFundsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RetireFundsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c9cf9ad9437d6066c128b952ee3e8617",
    "id": null,
    "metadata": {},
    "name": "RetireFundsMutation",
    "operationKind": "mutation",
    "text": "mutation RetireFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "94db9d4b4b3d89a14ae3dc2cc190b7fe";

export default node;
