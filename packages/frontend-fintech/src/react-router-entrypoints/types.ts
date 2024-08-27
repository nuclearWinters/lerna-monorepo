import { ComponentType } from "react";
import { PreloadedQuery, PreloadOptions } from "react-relay";
import {
  OperationType,
  PreloadableConcreteRequest,
  VariablesOf,
} from "relay-runtime";
import { Resource } from "./JSResource";
import { RouteData } from "./RouteRenderer";

export interface ThinQueryParams<TQuery extends OperationType> {
  readonly parameters: PreloadableConcreteRequest<TQuery>;
  readonly variables: VariablesOf<TQuery>;
  readonly options?: PreloadOptions | null | undefined;
  readonly environment: "auth" | "fintech";
}

export type ThinQueryParamsObject<
  TPreloadedQueries extends Record<string, OperationType>,
> = {
  [K in keyof TPreloadedQueries]: ThinQueryParams<TPreloadedQueries[K]>;
};

type PreloadedQueries<TPreloadedQueries> =
  TPreloadedQueries extends Record<string, OperationType>
    ? {
        [T in keyof TPreloadedQueries]: PreloadedQuery<TPreloadedQueries[T]>;
      }
    : never;

export type EntryPointPrepared<TPreloadedQueries> =
  PreloadedQueries<TPreloadedQueries>;

export interface RuntimePropsDefault {
  routeData: RouteData;
}

export interface EntryPointProps<
  TPreloadedQueries,
  TRuntimeProps extends object,
> {
  readonly props: TRuntimeProps & RuntimePropsDefault;
  readonly prepared: PreloadedQueries<TPreloadedQueries>;
}

export interface PreloadProps<
  TPreloadedQueries extends Record<string, OperationType>,
> {
  readonly queries?: ThinQueryParamsObject<TPreloadedQueries> | undefined;
}

export type EntryPointComponent<
  TPreloadedQueries extends Record<string, OperationType>,
  TRuntimeProps extends object = object,
> = ComponentType<EntryPointProps<TPreloadedQueries, TRuntimeProps>>;

interface InternalEntryPointRepresentation<
  TEntryPointParams extends object,
  TPreloadedQueries extends Record<string, OperationType>,
> {
  readonly root: Resource;
  readonly getPreloadProps: (
    entryPointParams: TEntryPointParams
  ) => PreloadProps<TPreloadedQueries>;
}

export type EntryPoint<
  TEntryPointComponent,
  TEntryPointParams extends object = object,
> = InternalEntryPointRepresentation<
  TEntryPointParams,
  TEntryPointComponent extends EntryPointComponent<
    infer TPreloadedQueries,
    object
  >
    ? TPreloadedQueries
    : never
>;
