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
