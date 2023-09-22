import { Dayjs } from "dayjs";

/**
 * DatePicker上で使用するカレンダーの日付の型
 *
 * - day: Day.jsのオブジェクト
 * - isThisMonthDay: 今月の日付
 * - isStarted: 選択されている開始日
 * - isEnded: 選択されている終了日
 * - isBetween: 開始日と終了日の間
 */
export type CalenderItemType = {
  day: Dayjs;
  isThisMonthDay: boolean;
  isStarted: boolean;
  isEnded: boolean;
  isBetween: boolean;
};

export type UserCalendarResponseProvider = {
  provider: string;
  calendarName: string;
  calendarId: string;
  count: number;
  events: UserCalendarResponseItem[];
};
export type UserCalendarProvider = {
  provider: string;
  calendarName: string;
  calendarId: string;
  count: number;
  events: UserCalendarItem[];
};

export type UserCalendarResponseItem =
  | UserCalendarItemDate
  | UserCalendarItemDateTime;

export type UserCalendarItemBase = {
  name: string;
  isAllDay: boolean;
  url: string;
  displayOnly: boolean;
};

export type UserCalendarItem = {
  start: Dayjs;
  end: Dayjs;
  id: UUID;
} & UserCalendarItemBase;

export type UserCalendarItemDate = {
  startTime: null;
  endTime: null;
  startDate: string;
  endDate: string;
} & UserCalendarItemBase;

export type UserCalendarItemDateTime = {
  startTime: string;
  endTime: string;
  startDate: null;
  endDate: null;
} & UserCalendarItemBase;
