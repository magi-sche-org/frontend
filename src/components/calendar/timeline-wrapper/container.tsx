import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC } from "react";
import { useRef } from "react";

import type { TSchedule, TTimeSchedule } from "@/@types/schedule";
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
  const filteredSchedules = filterSchedules(date, schedules);
  const dateSchedules = filteredSchedules.dateSchedule;
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
      <div className={Styles.date} onTouchStart={(e) => e.stopPropagation()}>
        <span className={Styles.text}>
          {date.get("date")} ({DayOfWeekName[day]})
        </span>
        {dateSchedules.length > 0 && (
          <>
            <div className={Styles.badge}>{dateSchedules.length}</div>
            <div className={Styles.schedules}>
              {dateSchedules.map((sche) => {
                return (
                  <div key={sche.url} className={Styles.schedule}>
                    <a
                      target={"_blank"}
                      href={sche.url}
                      className={Styles.link}
                    >
                      {sche.name}
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <CalendarTimelineContainer
        date={date}
        schedules={filteredSchedules.timeSchedule}
      />
    </div>
  );
};

type ContainerProps = {
  date: Dayjs;
  schedules: TTimeSchedule[];
};

const CalendarTimelineContainer: FC<ContainerProps> = ({ date, schedules }) => {
  const isToday = date.isSame(dayjs(), "day");
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={Styles.container} ref={ref}>
      <div className={Styles.background}>
        {timelineRange.map((_, i) => {
          return <div className={Styles.item} key={i}></div>;
        })}
      </div>
      {schedules.map((sche) => {
        return (
          <CalendarTimelineScheduleIndicator
            schedules={schedules}
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
