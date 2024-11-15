import { FC, ReactNode } from "react";
import { historyPush, historyReplace } from "./utils";
import { references, RouteKeys } from "../router";

export const Link: FC<{
  to: RouteKeys;
  replace?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ to, replace, children, className }) => {
  const preloadRouteCode = () => {
    references[to].entrypoint?.getComponent();
  };

  const preloadRoute = () => {
    references[to].loader();
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (replace) {
      historyReplace(to);
    } else {
      historyPush(to);
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      onMouseEnter={preloadRouteCode}
      onMouseDown={preloadRoute}
    >
      {children}
    </a>
  );
};
