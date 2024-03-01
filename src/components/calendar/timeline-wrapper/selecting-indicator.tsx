import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC } from "react";

import { getDateDiff } from "@/utils/date";

import Styles from "./selecting-indicator.module.scss";

type Props = {
  pos1: Dayjs;
  pos2: Dayjs;
  cardWidth: number;
  headerHeight: number;
  color?: string;
};

const CalendarTimelineSelectingIndicator: FC<Props> = ({
  pos1,
  pos2,
  cardWidth,
  headerHeight,
  color,
}) => {
  if (!pos1 || !pos2) return null;
  const pos1Diff = getDateDiff(pos1, dayjs());
  const diff = getDateDiff(pos1, pos2);
  const pos1Minute = pos1.get("hour") * 60 + pos1.get("minute");
  const pos2Minute = pos2.get("hour") * 60 + pos2.get("minute");
  const minMinute = Math.min(pos1Minute, pos2Minute);
  const maxMinute = Math.max(pos1Minute, pos2Minute);

  const style = {
    width: `${cardWidth * (Math.abs(diff) + 1)}px`,
    left: `${(pos1Diff - (diff > 0 ? diff : 0)) * cardWidth}px`,
    top: `calc((100% - ${headerHeight}px) * ${
      minMinute / 1440
    } + ${headerHeight}px)`,
    height: `calc((100% - ${headerHeight}px) * ${
      (maxMinute - minMinute) / 1440
    })`,
    background: color ?? "rgba(0, 255, 255, 0.2)",
  };

  return <div className={Styles.background} style={style}></div>;
};

export { CalendarTimelineSelectingIndicator };