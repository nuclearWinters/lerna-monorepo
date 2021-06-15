/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type Routes_query = {
  readonly user: {
    readonly id: string;
    readonly investments: ReadonlyArray<{
      readonly _id_loan: string;
      readonly quantity: number;
      readonly term: number;
      readonly ROI: number;
      readonly payments: number;
    }>;
    readonly accountAvailable: string;
    readonly " $fragmentRefs": FragmentRefs<
      "AddFunds_user" | "RetireFunds_user" | "AddLoan_user" | "Account_user"
    >;
  };
  readonly authUser: {
    readonly id: string;
    readonly name: string;
    readonly apellidoPaterno: string;
    readonly apellidoMaterno: string;
    readonly language: Languages;
    readonly isBorrower: boolean;
    readonly isSupport: boolean;
    readonly " $fragmentRefs": FragmentRefs<
      "Settings_auth_user" | "CheckExpiration_auth_user"
    >;
  };
  readonly " $refType": "Routes_query";
};
export type Routes_query$data = Routes_query;
export type Routes_query$key = {
  readonly " $data"?: Routes_query$data;
  readonly " $fragmentRefs": FragmentRefs<"Routes_query">;
};

const node: ReaderFragment = (function () {
  var v0 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any;
  return {
    argumentDefinitions: [
      {
        kind: "RootArgument",
        name: "id",
      },
    ],
    kind: "Fragment",
    metadata: null,
    name: "Routes_query",
    selections: [
      {
        alias: null,
        args: v0 /*: any*/,
        concreteType: "User",
        kind: "LinkedField",
        name: "user",
        plural: false,
        selections: [
          v1 /*: any*/,
          {
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
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "accountAvailable",
            storageKey: null,
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "AddFunds_user",
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "RetireFunds_user",
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "AddLoan_user",
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "Account_user",
          },
        ],
        storageKey: null,
      },
      {
        alias: null,
        args: v0 /*: any*/,
        concreteType: "AuthUser",
        kind: "LinkedField",
        name: "authUser",
        plural: false,
        selections: [
          v1 /*: any*/,
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
            name: "language",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "isBorrower",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "isSupport",
            storageKey: null,
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "Settings_auth_user",
          },
          {
            args: null,
            kind: "FragmentSpread",
            name: "CheckExpiration_auth_user",
          },
        ],
        storageKey: null,
      },
    ],
    type: "Query",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "318a3d24ff1bcacea14bcbb03f5fa835";
export default node;
