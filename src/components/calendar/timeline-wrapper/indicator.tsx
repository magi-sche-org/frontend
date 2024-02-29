import type { FC } from "react";

import { timelineRange } from "./const";
import Styles from "./indicator.module.scss";

type Props = {
  headerHeight: number;
};

const CalendarTimelineIndicator: FC<Props> = ({ headerHeight }) => {
  return (
    <div className={Styles.wrapper}>
      <div
        className={Styles.spacer}
        style={{
          height: headerHeight,
        }}
      />
      <div className={Styles.container}>
        {timelineRange.map((_, index) => {
          return (
            <div className={Styles.item} key={index}>
              <span className={Styles.text}>{index}</span>
              <span className={Styles.border}></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { CalendarTimelineIndicator };
