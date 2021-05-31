/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ApproveLoanInput = {
    clientMutationId?: string | null;
    loan_gid: string;
};
export type LoanRowMutationVariables = {
    input: ApproveLoanInput;
};
export type LoanRowMutationResponse = {
    readonly approveLoan: {
        readonly error: string;
        readonly validAccessToken: string;
    };
};
export type LoanRowMutation = {
    readonly response: LoanRowMutationResponse;
    readonly variables: LoanRowMutationVariables;
};



/*
mutation LoanRowMutation(
  $input: ApproveLoanInput!
) {
  approveLoan(input: $input) {
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
            "concreteType": "ApproveLoanPayload",
            "kind": "LinkedField",
            "name": "approveLoan",
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
            "name": "LoanRowMutation",
            "selections": (v1 /*: any*/),
            "type": "Mutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "LoanRowMutation",
            "selections": (v1 /*: any*/)
        },
        "params": {
            "cacheID": "3de6dd34fe4a2380611c57580908532b",
            "id": null,
            "metadata": {},
            "name": "LoanRowMutation",
            "operationKind": "mutation",
            "text": "mutation LoanRowMutation(\n  $input: ApproveLoanInput!\n) {\n  approveLoan(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '0c4b70dd1481d0b641ba6bcabed0ba21';
export default node;
