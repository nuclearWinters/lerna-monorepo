import { Component, ReactNode } from "react";
import { historyPush, historyReplace } from "./utils";

export class Link extends Component<{
  to: string;
  replace?: boolean;
  children: ReactNode;
}> {
  handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { replace, to } = this.props;
    event.preventDefault();

    replace ? historyReplace(to) : historyPush(to);
  };

  render() {
    const { to, children } = this.props;

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}
