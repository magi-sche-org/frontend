import { ArrowLeftIcon } from "@mui/x-date-pickers";
import type {
  FC,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { useEffect } from "react";
import { useRef } from "react";

import Styles from "./scroll-detector.module.scss";

type Props = {
  type: "left" | "right";
  scroll: () => void;
  onMouseDown?: (e: ReactMouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: ReactTouchEvent<HTMLDivElement>) => void;
};

const ScrollDetector: FC<Props> = ({
  type,
  scroll,
  onMouseDown,
  onTouchStart,
}) => {
  const timeoutRef = useRef<number>();

  const onEnter = (): void => {
    timeoutRef.current = window.setInterval(scroll, 500);
  };
  const onLeave = (): void => {
    window.clearTimeout(timeoutRef.current);
  };
  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`${Styles.wrapper} ${Styles[type]}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onTouchStart={onTouchStart}
      onMouseDown={onMouseDown}
    >
      <ArrowLeftIcon className={Styles.icon} />
    </div>
  );
};

export { ScrollDetector };
