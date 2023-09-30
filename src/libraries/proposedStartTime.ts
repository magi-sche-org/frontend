import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export const createProposedStartTimeList = (
  startDate: Dayjs | undefined,
  endDate: Dayjs | undefined,
  timePadding: number,
  duration: number,
  startTime: number,
  endTime: number,
): string[] => {
  if (startDate === undefined || endDate === undefined) {
    return [];
  }
  const dateArray: string[] = [];
  // 候補日の数
  const candidateDayNum = endDate.diff(startDate, "day") + 1;

  const baseStartDate = dayjs(startDate)
    .hour(startTime)
    .minute(0)
    .second(0)
    .millisecond(0);
  const baseEndDate = dayjs(startDate)
    .hour(endTime)
    .minute(0)
    .second(0)
    .millisecond(0)
    .subtract(duration, "seconds");

  [...(Array(candidateDayNum) as void[])].forEach((_, i) => {
    let stCopy = dayjs(baseStartDate).add(i, "day");
    const edCopy = dayjs(baseEndDate).add(i, "day");
    dateArray.push(stCopy.toISOString());
    while (stCopy.isBefore(edCopy)) {
      stCopy = stCopy.add(timePadding, "seconds");
      dateArray.push(stCopy.toISOString());
    }
  });
  return dateArray;
};
