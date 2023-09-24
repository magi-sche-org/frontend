import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

type CalenderControlType = {
  nowDate: Dayjs;
  dateArrayByWeek: Dayjs[][];
  addMonth: () => void;
  subtractMonth: () => void;
};

/**
 * カレンダーの表示を管理するhooks
 *
 * @returns nowDate：Day.jsのインスタンス
 * @returns dateArrayBeWeek：Dayjsの1ヶ月分の配列
 * @returns addMonth：カレンダーを1月後ろに進める
 * @returns subtractMonth:カレンダーを1月前に戻す
 */
export const useCalenderControl = (): CalenderControlType => {
  const [MonthPosition, setMonthPosition] = useState<number>(0);
  const dayObj = dayjs().startOf("month").add(MonthPosition, "month");
  const nowDate = dayObj;

  // 当月の最初の日付の曜日（位置 0~6）
  const firstDatePosition = dayObj.startOf("month").day();
  // 当月の最後の日付
  const lastDate = dayObj.endOf("month").date();
  // 当月の週の数
  const weekCount = Math.ceil((lastDate + firstDatePosition) / 7);

  // その月のカレンダーの最初から最後までの日付を配列に格納
  const dateArray = [...(Array(weekCount * 7) as void[])].map((_, index) => {
    return index < firstDatePosition
      ? dayObj.subtract(firstDatePosition - index, "day")
      : dayObj.add(index - firstDatePosition, "day");
  });
  // 7日ごとに配列に格納する
  const dateArrayByWeek = [...(Array(weekCount) as void[])].map((_, index) => {
    return dateArray.slice(index * 7, (index + 1) * 7);
  });

  /**
   * 月を前後させる
   * - addMonth: 1ヶ月後
   * - subtractMonth: 1ヶ月前
   */
  const addMonth = () => {
    setMonthPosition(MonthPosition + 1);
  };
  const subtractMonth = () => {
    setMonthPosition(MonthPosition - 1);
  };

  return { nowDate, dateArrayByWeek, addMonth, subtractMonth };
};
