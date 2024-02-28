import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC } from "react";
import { useRef } from "react";

import type { TSchedule } from "@/@types/schedule";
import { filterSchedules } from "@/utils/schedule";

import { DayOfWeekName } from "../static/week";
import { timelineRange } from "./const";
import Styles from "./container.module.scss";
import { CalendarTimelineCurrentTimeIndicator } from "./current-time-indicator";
import { CalendarTimelineScheduleIndicator } from "./schedule-indicator";

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

  return (
    <div className={Styles.container} ref={ref}>
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
    </div>
  );
};

export { CalendarTimelineWrapper };
