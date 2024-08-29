import { FC } from "react";

import {
  type PreparedProps as PreparedAccount,
  type Props as PropsAccount,
} from "../authSrc/screens/Account/Account";
import {
  type PreparedProps as PreparedAddFunds,
  type Props as PropsAddFunds,
} from "../authSrc/screens/AddFunds/AddFunds";
import {
  type PreparedProps as PreparedAddInvestments,
  type Props as PropsAddInvestments,
} from "../authSrc/screens/AddInvestments/AddInvestments";
import {
  type PreparedProps as PreparedAddLoan,
  type Props as PropsAddLoan,
} from "../authSrc/screens/AddLoan/AddLoan";
import {
  type PreparedProps as PreparedApproveLoan,
  type Props as PropsApproveLoan,
} from "../authSrc/screens/ApproveLoan/ApproveLoan";
import {
  type PreparedProps as PreparedHeaderAuth,
  type Props as PropsHeaderAuth,
} from "../authSrc/screens/HeaderAuth/HeaderAuth";
import {
  type PreparedProps as PreparedMyInvestments,
  type Props as PropsMyInvestments,
} from "../authSrc/screens/MyInvestments/MyInvestments";
import {
  type PreparedProps as PreparedMyLoans,
  type Props as PropsMyLoans,
} from "../authSrc/screens/MyLoans/MyLoans";
import {
  type PreparedProps as PreparedRetireFunds,
  type Props as PropsRetireFunds,
} from "../authSrc/screens/RetireFunds/RetireFunds";
import {
  type PreparedProps as PreparedMyTransactions,
  type Props as PropsMyTransactions,
} from "../authSrc/screens/MyTransactions/MyTransactions";
import {
  type PreparedProps as PreparedSettings,
  type Props as PropsSettings,
} from "../authSrc/screens/Settings/Settings";

export type RegisteredPreparedProps = PreparedAccount &
  PreparedAddFunds &
  PreparedAddInvestments &
  PreparedAddLoan &
  PreparedApproveLoan &
  PreparedHeaderAuth &
  PreparedMyInvestments &
  PreparedMyLoans &
  PreparedRetireFunds &
  PreparedMyTransactions &
  PreparedSettings;

export type RegisteredDefaultExportProps =
  | PropsApproveLoan
  | PropsHeaderAuth
  | PropsAccount
  | PropsAddFunds
  | PropsAddInvestments
  | PropsAddLoan
  | PropsMyInvestments
  | PropsMyLoans
  | PropsRetireFunds
  | PropsMyTransactions
  | PropsSettings;

type RegisteredDefaultExports =
  | FC<PropsApproveLoan>
  | FC<PropsHeaderAuth>
  | FC<PropsAccount>
  | FC<PropsAddFunds>
  | FC<PropsAddInvestments>
  | FC<PropsAddLoan>
  | FC<PropsMyInvestments>
  | FC<PropsMyLoans>
  | FC<PropsRetireFunds>
  | FC<PropsMyTransactions>
  | FC<PropsSettings>;

const resourceMap = new Map<string, Resource>();

interface PromiseDefaultExport<T = RegisteredDefaultExports> {
  default: T;
}

export interface CustomJSResourceReference<T> {
  read(): T;
  getModuleId(): string;
  getModuleIfRequired(): T | null;
  load(): Promise<T>;
}

export class Resource<T = RegisteredDefaultExports>
  implements CustomJSResourceReference<T>
{
  #error: Error | null = null;
  #promise: Promise<T> | null = null;
  #result: T | null = null;
  #moduleId: string;
  #loader: () => Promise<PromiseDefaultExport<T>>;

  constructor(
    moduleId: string,
    loader: () => Promise<PromiseDefaultExport<T>>
  ) {
    this.#moduleId = moduleId;
    this.#loader = loader;
  }

  load() {
    const promise = this.#promise;
    if (promise == null) {
      const returnPromise = this.#loader()
        .then((result) => {
          this.#result = result.default;
          return this.#result;
        })
        .catch((error) => {
          this.#error = error;
          throw error;
        });
      this.#promise = returnPromise;
      return returnPromise;
    }
    return promise;
  }

  getModuleIfRequired(): T | null {
    return this.#result;
  }

  read() {
    if (this.#result != null) {
      return this.#result;
    } else if (this.#error != null) {
      throw this.#error;
    } else {
      throw this.#promise;
    }
  }

  getModuleId(): string {
    return this.#moduleId;
  }
}

export function JSResource(
  moduleId: string,
  loader: () => Promise<PromiseDefaultExport>
): Resource {
  let resource = resourceMap.get(moduleId);
  if (resource == null) {
    resource = new Resource(moduleId, loader);
    resourceMap.set(moduleId, resource);
  }
  return resource;
}

/*type TypedResource<D> = D extends "Account" ? FC<PropsAccount> : never;

export function JSResourceTyped<
  D extends "Account" | "AddInvestments",
  T extends () => D extends "Account"
    ? Promise<{ default: FC<PropsAccount> }>
    : never,
>(moduleId: D, loader: T): Resource<TypedResource<D>> {
  let resource = resourceMap.get(moduleId);
  if (resource == null) {
    resource = new Resource(moduleId, loader);
    resourceMap.set(moduleId, resource);
  }
  return new Resource(moduleId, loader) as Resource<TypedResource<D>>;
}*/

/*interface Wrapper<T> {
  value: Promise<T>;
}

interface Flags {
  flag1: 1;
  flag2: "1";
  flag3: boolean;
  flag4: number;
}

function getFlag<T extends keyof Flags>(
  flag: T,
  loader: () => Promise<{ default: Flags[T] }>
): Wrapper<Flags[T]> {
  const promise = loader().then((result) => {
    return result.default;
  });
  return { value: promise };
}

const result = getFlag("flag1", () => Promise.resolve({ default: 1 }));

result.value.then((value) => {
  console.log(value);
});*/
