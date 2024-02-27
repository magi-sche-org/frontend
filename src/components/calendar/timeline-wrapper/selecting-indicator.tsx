import type { FC } from "react";
import { useContext } from "react";

import { getDateDiff } from "@/utils/date";

import { SelectingDateContext } from "./context";
import Styles from "./selecting-indicator.module.scss";

const CalendarTimelineSelectingIndicator: FC = () => {
  const context = useContext(SelectingDateContext);
  const pos1 = context?.selectingDate?.pos1;
  const pos2 = context?.selectingDate?.pos2;
  if (!pos1 || !pos2) return null;
  const diff = getDateDiff(pos1, pos2);
  const pos1Minute = pos1.get("hour") * 60 + pos1.get("minute");
  const pos2Minute = pos2.get("hour") * 60 + pos2.get("minute");
  const minMinute = Math.min(pos1Minute, pos2Minute);
  const maxMinute = Math.max(pos1Minute, pos2Minute);

  const style = {
    width: `calc((100% + 1px) * ${Math.abs(diff) + 1})`,
    left: `calc((100% + 1px) * ${diff > 0 ? diff * -1 : 0})`,
    top: `${(minMinute / 1440) * 100}%`,
    height: `${((maxMinute - minMinute) / 1440) * 100}%`,
  };

  return <div className={Styles.background} style={style}></div>;
};

export { CalendarTimelineSelectingIndicator };
