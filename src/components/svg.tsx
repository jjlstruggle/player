import { ReactComponent as HomeSvg } from "@assets/svg/home.svg";
import { ReactComponent as MySvg } from "@assets/svg/my.svg";
import classnames from "classnames";
import { FunctionComponent, SVGProps } from "react";

function buildSvg(Icon: FunctionComponent<SVGProps<SVGSVGElement>>) {
  return (props: { className?: string }) => (
    <Icon className={classnames(props.className || "")} />
  );
}

export const Home = buildSvg(HomeSvg);
export const My = buildSvg(MySvg);
