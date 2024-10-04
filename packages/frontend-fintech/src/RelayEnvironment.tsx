import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  Observable,
  GraphQLResponse,
} from "relay-runtime";
import { AUTH_API, FINTECH_API, Decode } from "./utils";
import { jwtDecode } from "./utils";

const subscribeRelayAuth = (
  operation: RequestParameters,
  variables: Variables
) => {
  return Observable.create<GraphQLResponse>((sink) => {
    const { text, id, name } = operation;
    if (!(text || id)) {
      return sink.error(new Error("Operation text or id cannot be empty"));
    }
    fetch(AUTH_API, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        operationName: name,
        extensions: {
          doc_id: id,
        },
        variables,
      }),
      headers: {
        Authorization: sessionStorage.getItem("accessToken") ?? "",
      },
    })
      .then((response) => {
        const reader = response?.body?.getReader();
        const accesstoken = response.headers.get("accessToken");
        if (
          accesstoken &&
          sessionStorage.getItem("accessToken") !== accesstoken
        ) {
          const decoded = jwtDecode<Decode>(accesstoken);
          sessionStorage.setItem("accessToken", accesstoken);
          sessionStorage.setItem("userData", JSON.stringify(decoded));
        }
        if (sessionStorage.getItem("accessToken") && !accesstoken) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("userData");
          return window.location.reload();
        }
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No body");
        return new Promise<void>((resolve) => {
          reader.read().then(function pump({
            done,
            value,
          }): undefined | Promise<undefined> {
            if (done) {
              resolve();
              return;
            }
            const result = decoder.decode(value);
            const stream = result.split("\n");
            const unparsed = stream[1].replace("data: ", "");
            const data = unparsed === "data:" ? null : JSON.parse(unparsed);
            sink.next(data);
            return reader.read().then(pump);
          });
        });
      })
      .then(() => sink.complete())
      .catch((err) => sink.error(err));
    return () => {};
  });
};

const subscribeRelayFintech = (
  operation: RequestParameters,
  variables: Variables
) => {
  return Observable.create<GraphQLResponse>((sink) => {
    const { text, id, name } = operation;
    if (!(text || id)) {
      return sink.error(new Error("Operation text or id cannot be empty"));
    }
    fetch(FINTECH_API, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        operationName: name,
        extensions: {
          doc_id: id,
        },
        variables,
      }),
      headers: {
        Authorization: sessionStorage.getItem("accessToken") ?? "",
      },
    })
      .then((response) => {
        const reader = response?.body?.getReader();
        const accesstoken = response.headers.get("accessToken");
        if (
          accesstoken &&
          sessionStorage.getItem("accessToken") !== accesstoken
        ) {
          const decoded = jwtDecode<Decode>(accesstoken);
          sessionStorage.setItem("accessToken", accesstoken);
          sessionStorage.setItem("userData", JSON.stringify(decoded));
        }
        if (sessionStorage.getItem("accessToken") && !accesstoken) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("userData");
          return window.location.reload();
        }
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No body");
        return new Promise<void>((resolve) => {
          reader.read().then(function pump({
            done,
            value,
          }): undefined | Promise<undefined> {
            if (done) {
              resolve();
              return;
            }
            const result = decoder.decode(value);
            const stream = result.split("\n");
            const unparsed = stream[1].replace("data: ", "");
            const data = unparsed === "data:" ? null : JSON.parse(unparsed);
            if (Array.isArray(data?.extensions?.modules)) {
              registerModuleLoaders(data.extensions.modules);
            }
            sink.next(data);
            return reader.read().then(pump);
          });
        });
      })
      .then(() => sink.complete())
      .catch((err) => sink.error(err));
    return () => {};
  });
};

const networkAuth = Network.create(subscribeRelayAuth, subscribeRelayAuth);
const networkFintech = Network.create(
  subscribeRelayFintech,
  subscribeRelayFintech
);

const operationLoader = {
  get: (name: string) => {
    return moduleLoader(name).get();
  },
  load: (name: string) => {
    return moduleLoader(name).load();
  },
};

export const RelayEnvironmentAuth = new Environment({
  network: networkAuth,
  store: new Store(new RecordSource(), { operationLoader }),
  operationLoader,
  isServer: false,
});

export const RelayEnvironmentFintech = new Environment({
  network: networkFintech,
  store: new Store(new RecordSource(), { operationLoader }),
  operationLoader,
  isServer: false,
});

function registerModuleLoaders(modules: string[]) {
  modules.forEach((module) => {
    if (module.endsWith("$normalization.graphql")) {
      registerLoader(
        module,
        () => import(`./fintechSrc/components/__generated__/${module}.ts`)
      );
    } else {
      registerLoader(
        module,
        () => import(`./fintechSrc/components/${module}.tsx`)
      );
    }
  });
}

const loaders = new Map();
const loadedModules = new Map();
const failedModules = new Map();
const pendingLoaders = new Map();

export default function moduleLoader(name: string) {
  return {
    getError() {
      return failedModules.get(name);
    },
    resetError() {
      failedModules.delete(name);
    },
    get() {
      const module = loadedModules.get(name);
      return module == null ? null : module.default;
    },
    load() {
      const loader = loaders.get(name);
      if (loader == null) {
        const promise = new Promise((resolve, reject) => {
          loaders.set(name, {
            kind: "pending",
            resolve,
            reject,
          });
        });
        pendingLoaders.set(name, promise);
        return promise;
      } else if (loader.kind === "registered") {
        return loader.loaderFn().then(
          (module: { default: unknown }) => {
            loadedModules.set(name, module);
            return module.default;
          },
          (error: Error) => {
            failedModules.set(name, error);
            throw error;
          }
        );
      } else if (loader.kind === "pending") {
        return pendingLoaders.get(name);
      }
    },
  };
}

export function registerLoader(
  name: string,
  loaderFn: () => Promise<{ default: unknown }>
) {
  const loader = loaders.get(name);
  if (loader == null) {
    loaders.set(name, {
      kind: "registered",
      loaderFn,
    });
  } else if (loader.kind === "pending") {
    loaderFn().then(
      (module) => {
        loadedModules.set(name, module);
        pendingLoaders.delete(name);
        loader.resolve(module.default);
      },
      (error: Error) => {
        failedModules.set(name, error);
        pendingLoaders.delete(name);
        loader.reject(error);
      }
    );
  }
}
