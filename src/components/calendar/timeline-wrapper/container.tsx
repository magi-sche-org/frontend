import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC, MouseEvent } from "react";
import { useContext, useRef } from "react";

import type { TSchedule } from "@/@types/schedule";
import { filterSchedules } from "@/utils/schedule";

import { DayOfWeekName } from "../static/week";
import { timelineRange } from "./const";
import Styles from "./container.module.scss";
import { SelectingDateContext } from "./context";
import { CalendarTimelineCurrentTimeIndicator } from "./current-time-indicator";
import { CalendarTimelineScheduleIndicator } from "./schedule-indicator";
import { CalendarTimelineSelectingIndicator } from "./selecting-indicator";

type Props = {
  schedules?: TSchedule[];
  date: Dayjs;
  width?: number;
};

const CalendarTimelineWrapper: FC<Props> = ({ date, schedules, width }) => {
  const day = date.get("day");
  return (
    <div
      className={`${Styles.wrapper} ${
        (day === 0 || day === 6) && Styles.weekend
      }`}
      style={{
        width,
      }}
    >
      <div className={Styles.date}>
        {date.get("date")} ({DayOfWeekName[day]})
      </div>
      <CalendarTimelineContainer date={date} schedules={schedules} />
    </div>
  );
};

const CalendarTimelineContainer: FC<Props> = ({ date, schedules }) => {
  const timeSchedules =
    schedules && filterSchedules(date, schedules).timeSchedule;
  const isToday = date.isSame(dayjs(), "day");
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(SelectingDateContext);
  const isSelectionStart = date.isSame(context?.selectingDate?.pos1, "day");

  const getDate = (e: MouseEvent<HTMLDivElement>): Dayjs | undefined => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientY - rect.top) / rect.height;
    const hour = Math.floor(x * 24);
    const minute = Math.floor((x * 24 - hour) * 2) * 30;
    return date
      .set("hour", hour)
      .set("minute", minute)
      .set("second", 0)
      .set("millisecond", 0);
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    const pos1 = getDate(e);
    context?.setSelectingDate((pv) => ({ ...pv, pos1 }));
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (!context?.selectingDate?.pos1) return;
    const pos2 = getDate(e);
    context?.setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>): void => {
    if (!context?.selectingDate?.pos1) return;
    const pos2 = getDate(e);
    if (!pos2) return;
    context?.setSelectingDate({});
    context?.dispatchOnChange(context.selectingDate.pos1, pos2);
  };

  return (
    <div
      className={Styles.container}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={ref}
    >
      <div className={Styles.background}>
        {timelineRange.map((_, i) => {
          return <div className={Styles.item} key={i}></div>;
        })}
      </div>
      {timeSchedules?.map((sche) => {
        return (
          <CalendarTimelineScheduleIndicator
            schedules={timeSchedules}
            schedule={sche}
            key={sche.url}
          />
        );
      })}
      {isToday && <CalendarTimelineCurrentTimeIndicator />}
      {isSelectionStart && <CalendarTimelineSelectingIndicator />}
    </div>
  );
};

export { CalendarTimelineWrapper };
