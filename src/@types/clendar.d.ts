import type { Dayjs } from "dayjs";

import type { TSchedule } from "./schedule";

export type CalendarProps = {
  date: Dayjs;
  schedules?: TSchedule[];
};
