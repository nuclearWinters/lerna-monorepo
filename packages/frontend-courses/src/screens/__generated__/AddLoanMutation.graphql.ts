/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLoanInput = {
    clientMutationId?: string | null;
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
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "input"
        } as any
    ], v1 = [
        {
            "alias": null,
            "args": [
                {
                    "kind": "Variable",
                    "name": "input",
                    "variableName": "input"
                }
            ],
            "concreteType": "AddLoanPayload",
            "kind": "LinkedField",
            "name": "addLoan",
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
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "AddLoanMutation",
            "selections": (v1 /*: any*/),
            "type": "Mutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "AddLoanMutation",
            "selections": (v1 /*: any*/)
        },
        "params": {
            "cacheID": "ddc2af4eeaf57ce271d4bc2f7c4f7147",
            "id": null,
            "metadata": {},
            "name": "AddLoanMutation",
            "operationKind": "mutation",
            "text": "mutation AddLoanMutation(\n  $input: AddLoanInput!\n) {\n  addLoan(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = 'fcd80089e064adae267565217b35b0c5';
export default node;
