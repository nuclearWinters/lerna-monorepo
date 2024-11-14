import { FC, ReactNode } from "react";
import { historyPush, historyReplace } from "./utils";

export const Link: FC<{
  to: string;
  replace?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ to, replace, children, className }) => {
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
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
