import {
  useTransition,
  useContext,
  useEffect,
  Suspense,
  useState,
  FC,
  ReactNode,
} from "react";
import { Entry, RoutingContext } from "./RoutingContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { EntryPointParams } from "./createRouter";
import { RegisteredPreparedProps, Resource } from "./JSResource";

export interface RouteData {
  path: string;
  url: string;
  params: EntryPointParams;
  isExact: boolean;
}

//One component per route?
const RouteComponent: FC<{
  children?: ReactNode;
  component: Resource;
  prepared: RegisteredPreparedProps;
  routeData: RouteData;
}> = (props) => {
  const Component = props.component.read();

  const { routeData, prepared, children } = props;
  return (
    <Component prepared={prepared} props={{ children, routeData }}></Component>
  );
};

export function RouterRenderer() {
  const router = useContext(RoutingContext);
  const [isPending, startTransition] = useTransition();

  const [routeEntry, setRouteEntry] = useState(router?.get());

  useEffect(() => {
    const currentEntry = router?.get();
    if (currentEntry !== routeEntry) {
      setRouteEntry(currentEntry);
      return;
    }

    const dispose = router?.subscribe((nextEntry) => {
      startTransition(() => {
        setRouteEntry(nextEntry);
      });
    });
    return () => dispose?.();
  }, [router, startTransition]);

  const reversedItems = ([] as Entry[])
    .concat(routeEntry?.entries ?? [])
    .reverse();
  const firstItem = reversedItems[0];
  let routeComponent = (
    <RouteComponent
      component={firstItem.component}
      prepared={firstItem.prepared}
      routeData={firstItem.routeData}
    />
  );
  for (let ii = 1; ii < reversedItems.length; ii++) {
    const nextItem = reversedItems[ii];
    routeComponent = (
      <RouteComponent
        component={nextItem.component}
        prepared={nextItem.prepared}
        routeData={nextItem.routeData}
      >
        {routeComponent}
      </RouteComponent>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={"Loading fallback..."}>
        {isPending ? (
          <div className="RouteRenderer-pending">Loading pending...</div>
        ) : null}
        {routeComponent}
      </Suspense>
    </ErrorBoundary>
  );
}
