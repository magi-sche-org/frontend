import "dayjs/plugin/isBetween";

import { Stack } from "@mui/system";
import type { Dayjs } from "dayjs";

import type { CalenderItemType } from "@/@types/calender";
import { useCalenderControl } from "@/hooks/useCalenderControl";

import { CalenderBody } from "./CalenderBody";
import { CalenderControlHeader } from "./CalenderControlHeader";
import { CalenderHeader } from "./CalenderHeader";

type Props = {
  startDay: Dayjs | undefined;
  endDay: Dayjs | undefined;
  setStartDay: (newValue: Dayjs | undefined) => void;
  setEndDay: (newValue: Dayjs | undefined) => void;
};

/**
 * 日付間の開始日・終了日をカレンダーから選択
 *
 * @param startDay 開始日
 * @param endDay 終了日
 * @param setStartDay 開始日を更新するhandler
 * @param setEndDay 終了日を更新するhandler
 */
export const DateRangePicker = ({
  startDay,
  endDay,
  setStartDay,
  setEndDay,
}: Props) => {
  const { nowDate, dateArrayByWeek, addMonth, subtractMonth } =
    useCalenderControl();

  // startDay・endDayがどちらか一方が存在しない
  const isUndefinedSelectedDay = startDay === undefined || endDay === undefined;
  // startDay・endDayが同じ日付
  const isSameDay = startDay?.isSame(endDay) ?? false;

  /**
   * startDayとendDayの選択handler
   * @param day 選択された日付
   *
   * - 開始日・終了日が既に存在する場合：開始日を設定し、終了日を削除
   * - 開始日のみが存在する場合：終了日を設定
   * - 終了日に開始日より前の日付が設定される場合：開始日と終了日を入れ替える
   */
  const handleSelectDay = (day: Dayjs) => {
    if (!isUndefinedSelectedDay) {
      setStartDay(day);
      setEndDay(undefined);
    } else if (endDay === undefined) {
      if (day > startDay!) {
        setEndDay(day);
      } else {
        setEndDay(startDay);
        setStartDay(day);
      }
    }
  };

  /**
   * CalenderItemTypeに変換する
   * - isStarted: startDayでtrue
   * - isEnded: endDayでtrue
   * - isBetween: startDay < dayNumber < endDay でtrue
   */
  const calenderArray: CalenderItemType[][] = dateArrayByWeek.map(
    (weekArray) => {
      return weekArray.map((day) => {
        const dayStr = day.format("YYYY-MM-DD");
        const startDayStr = startDay?.format("YYYY-MM-DD") ?? "";
        const endDayStr = endDay?.format("YYYY-MM-DD") ?? "";
        const isUndefinedSelectedDay = startDayStr === "" || endDayStr === "";

        const isThisMonthDay = day.month() === nowDate.month();
        const isStarted = dayStr === startDayStr;
        const isEnded = dayStr === endDayStr;
        const isBetween = isUndefinedSelectedDay
          ? false
          : day.isBetween(startDay, endDay);

        return {
          day,
          isThisMonthDay,
          isStarted,
          isEnded,
          isBetween,
        };
      });
    },
  );

  return (
    <Stack justifyContent="center" spacing={1}>
      <CalenderControlHeader
        headerLabel={nowDate.format("YYYY年MM月")}
        addMonth={addMonth}
        subtractMonth={subtractMonth}
      />
      <CalenderHeader />
      <CalenderBody
        calenderArray={calenderArray}
        handleSelectDay={handleSelectDay}
        isUndefinedSelectedDay={isUndefinedSelectedDay}
        isSameDay={isSameDay}
      />
    </Stack>
  );
};
