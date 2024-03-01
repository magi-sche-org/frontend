import type { Dayjs } from "dayjs";

export type TSchedule = TTimeSchedule | TDateSchedule;
export type TTimeSchedule = {
  name: string;
  url: string;
  displayOnly: boolean;
  startTime: Dayjs;
  endTime: Dayjs;
  startDate: null;
  endDate: null;
  isAllDay: false;
  color: string;
};

export type TDateSchedule = {
  name: string;
  url: string;
  displayOnly: boolean;
  startDate: Dayjs;
  endDate: Dayjs;
  startTime: null;
  endTime: null;
  isAllDay: true;
  color: string;
};
