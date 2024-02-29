import type { FC } from "react";
import { useEffect } from "react";

const ScrollBlocker: FC = () => {
  useEffect(() => {
    const onWindowScroll = (e: Event): void => {
      e.preventDefault();
    };
    window.addEventListener("scroll", onWindowScroll);
    return () => window.removeEventListener("scroll", onWindowScroll);
  });
  return <></>;
};

export { ScrollBlocker };
