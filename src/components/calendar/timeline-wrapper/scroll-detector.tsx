import type { FC } from "react";
import { useRef } from "react";

import Styles from "./scroll-detector.module.scss";

type Props = {
  type: "left" | "right";
  scroll: () => void;
};

const ScrollDetector: FC<Props> = ({ type, scroll }) => {
  const timeoutRef = useRef<number>();

  const onEnter = (): void => {
    timeoutRef.current = window.setInterval(scroll, 500);
    console.log("onEnter");
  };
  const onLeave = (): void => {
    window.clearTimeout(timeoutRef.current);
    console.log("onLeave");
  };

  return (
    <div
      className={`${Styles.wrapper} ${Styles[type]}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    />
  );
};

export { ScrollDetector };
