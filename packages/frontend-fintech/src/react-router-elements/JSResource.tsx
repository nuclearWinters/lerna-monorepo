import { JSResourceReference } from "react-relay";

const map = new Map<string, JSResourceReference<any>>();

export class Resource<T> {
  _moduleId: string;
  _loader: () => Promise<{ default: T }>;
  _loadingPromise?: Promise<T>;
  _module?: T;

  constructor(moduleId: string, loader: () => Promise<{ default: T }>) {
    this._moduleId = moduleId;
    this._loader = loader;
    this._loadingPromise = undefined;
    this._module = undefined;
  }

  getModuleId(): string {
    return this._moduleId;
  }

  getModuleIfRequired(): T | undefined {
    return this._module;
  }

  load(): Promise<T> {
    if (!this._loadingPromise) {
      this._loadingPromise = this._loader()
        .then((module) => {
          this._module = module.default;
          return this._module;
        })
        .catch((error) => {
          throw error;
        });
    }
    return this._loadingPromise;
  }
}

export default function JSResource<T>(
  moduleId: string,
  loader: () => Promise<{ default: T }>
): JSResourceReference<T> {
  let resource = map.get(moduleId);
  if (resource == null) {
    resource = new Resource<T>(moduleId, loader);
    map.set(moduleId, resource);
  }
  return resource;
}
