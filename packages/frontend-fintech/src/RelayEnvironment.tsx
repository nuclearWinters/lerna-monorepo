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
import { jwtDecode } from "jwt-decode";
import { Sink, createClient } from "graphql-sse";

const subscriptionsClientAuth = createClient({
  url: AUTH_API,
  headers: {
    Authorization: sessionStorage.getItem("accessToken") ?? "",
  },
  fetchFn: async (url: string, config: RequestInit) => {
    const response = await fetch(url, config);
    const accesstoken = response.headers.get("accessToken");
    if (accesstoken && sessionStorage.getItem("accessToken") !== accesstoken) {
      const decoded = jwtDecode<Decode>(accesstoken);
      sessionStorage.setItem("accessToken", accesstoken);
      sessionStorage.setItem("userData", JSON.stringify(decoded));
    }
    if (sessionStorage.getItem("accessToken") && !accesstoken) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      return window.location.reload();
    }
    return response;
  },
});

const subscriptionsClientFintech = createClient({
  url: FINTECH_API,
  headers: {
    Authorization: sessionStorage.getItem("accessToken") ?? "",
  },
  fetchFn: async (url: string, config: RequestInit) => {
    const response = await fetch(url, config);
    const accesstoken = response.headers.get("accessToken");
    if (accesstoken && sessionStorage.getItem("accessToken") !== accesstoken) {
      const decoded = jwtDecode<Decode>(accesstoken);
      sessionStorage.setItem("accessToken", accesstoken);
      sessionStorage.setItem("userData", JSON.stringify(decoded));
    }
    if (sessionStorage.getItem("accessToken") && !accesstoken) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      return window.location.reload();
    }
    return response;
  },
});

/*const fetchRelay = async (params: RequestParameters, variables: Variables) => {
  const response = await fetch(API_GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      doc_id: params.id,
      query: params?.text || "",
      variables,
    }),
  });
  const data = await response.json();
  const accesstoken = response.headers.get("accessToken");
  if (accesstoken && sessionStorage.getItem("accessToken") !== accesstoken) {
    const decoded = jwtDecode<Decode>(accesstoken);
    sessionStorage.setItem("accessToken", accesstoken);
    sessionStorage.setItem("userData", JSON.stringify(decoded));
  }

  if (sessionStorage.getItem("accessToken") && !accesstoken) {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    return window.location.reload();
  }

  if (Array.isArray(data?.extensions?.modules)) {
    registerModuleLoaders(data.extensions.modules);
  }

  return data;
};*/

const subscribeRelayAuth = (
  operation: RequestParameters,
  variables: Variables
) => {
  return Observable.create<GraphQLResponse>((sink) => {
    const { text, id, name } = operation;
    if (!(text || id)) {
      return sink.error(new Error("Operation text or id cannot be empty"));
    }
    return subscriptionsClientAuth.subscribe(
      {
        operationName: name,
        query: text || "",
        variables,
        extensions: {
          doc_id: id,
        },
      },
      sink as Sink
    );
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
    subscriptionsClientFintech.iterate;
    return subscriptionsClientFintech.subscribe(
      {
        operationName: name,
        query: text || "",
        variables,
        extensions: {
          doc_id: id,
        },
      },
      sink as Sink
    );
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

const RelayEnvironmentAuth = new Environment({
  network: networkAuth,
  store: new Store(new RecordSource(), { operationLoader }),
  operationLoader,
  isServer: false,
});

const RelayEnvironmentFintech = new Environment({
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
        () => import(`./fintechSrc/components/__generated__/${module}`)
      );
    } else {
      registerLoader(module, () => import(`./components/${module}`));
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
          (module: any) => {
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

export function registerLoader(name: string, loaderFn: any) {
  const loader = loaders.get(name);
  if (loader == null) {
    loaders.set(name, {
      kind: "registered",
      loaderFn,
    });
  } else if (loader.kind === "pending") {
    loaderFn().then(
      (module: any) => {
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

export { RelayEnvironmentAuth, RelayEnvironmentFintech };
