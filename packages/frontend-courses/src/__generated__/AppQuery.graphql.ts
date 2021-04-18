/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AppQueryVariables = {};
export type AppQueryResponse = {
  readonly user: {
    readonly " $fragmentRefs": FragmentRefs<"Routes_user">;
  };
};
export type AppQuery = {
  readonly response: AppQueryResponse;
  readonly variables: AppQueryVariables;
};

/*
query AppQuery {
  user(id: "facebook") {
    ...Routes_user
    id
  }
}

fragment GeneralData_user on User {
  id
  name
  apellidoPaterno
  apellidoMaterno
  RFC
  CURP
  clabe
  mobile
  email
  password
  accountTotal
  accountAvailable
}

fragment Routes_user on User {
  name
  apellidoPaterno
  apellidoMaterno
  accountTotal
  accountAvailable
  ...GeneralData_user
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      kind: "Literal",
      name: "id",
      value: "facebook",
    } as any,
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v0 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            {
              args: null,
              kind: "FragmentSpread",
              name: "Routes_user",
            },
          ],
          storageKey: 'user(id:"facebook")',
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v0 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "name",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "apellidoPaterno",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "apellidoMaterno",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "accountTotal",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "accountAvailable",
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
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "RFC",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "CURP",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "clabe",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "mobile",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "email",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "password",
              storageKey: null,
            },
          ],
          storageKey: 'user(id:"facebook")',
        },
      ],
    },
    params: {
      cacheID: "d5e962f2cacf1fd26c8d45c97c875184",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text:
        'query AppQuery {\n  user(id: "facebook") {\n    ...Routes_user\n    id\n  }\n}\n\nfragment GeneralData_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  email\n  password\n  accountTotal\n  accountAvailable\n}\n\nfragment Routes_user on User {\n  name\n  apellidoPaterno\n  apellidoMaterno\n  accountTotal\n  accountAvailable\n  ...GeneralData_user\n}\n',
    },
  } as any;
})();
(node as any).hash = "c5485ad76ecbb3b39a66921b0516ad50";
export default node;
