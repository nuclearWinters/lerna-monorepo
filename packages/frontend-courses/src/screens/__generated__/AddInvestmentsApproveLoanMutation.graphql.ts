/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ApproveLoanInput = {
    clientMutationId?: string | null;
    loan_gid: string;
};
export type AddInvestmentsApproveLoanMutationVariables = {
    input: ApproveLoanInput;
};
export type AddInvestmentsApproveLoanMutationResponse = {
    readonly approveLoan: {
        readonly error: string;
        readonly validAccessToken: string;
    };
};
export type AddInvestmentsApproveLoanMutation = {
    readonly response: AddInvestmentsApproveLoanMutationResponse;
    readonly variables: AddInvestmentsApproveLoanMutationVariables;
};



/*
mutation AddInvestmentsApproveLoanMutation(
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
            "name": "AddInvestmentsApproveLoanMutation",
            "selections": (v1 /*: any*/),
            "type": "Mutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "AddInvestmentsApproveLoanMutation",
            "selections": (v1 /*: any*/)
        },
        "params": {
            "cacheID": "2dc1b092a622bc95322d296101d490ac",
            "id": null,
            "metadata": {},
            "name": "AddInvestmentsApproveLoanMutation",
            "operationKind": "mutation",
            "text": "mutation AddInvestmentsApproveLoanMutation(\n  $input: ApproveLoanInput!\n) {\n  approveLoan(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = 'cd2c4a3b3b8d2bf219c72447200fe8f6';
export default node;
