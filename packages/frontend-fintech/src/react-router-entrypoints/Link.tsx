import { RoutingContext } from "./RoutingContext";
import { FC, ReactNode, useCallback, useContext } from "react";

interface Props {
  to: string;
  children: ReactNode;
}

export const Link: FC<Props> = (props) => {
  const router = useContext(RoutingContext);

  const changeRoute = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      router?.history.push(props.to);
    },
    [props.to, router]
  );

  const preloadRouteCode = useCallback(() => {
    router?.preloadCode(props.to);
  }, [props.to, router]);

  const preloadRoute = useCallback(() => {
    router?.preload(props.to);
  }, [props.to, router]);

  return (
    <a
      href={props.to}
      onClick={changeRoute}
      onMouseEnter={preloadRouteCode}
      onMouseDown={preloadRoute}
    >
      {props.children}
    </a>
  );
};
