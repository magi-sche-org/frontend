import type { Dayjs } from "dayjs";

const getDateDiff = (_date1: Dayjs, _date2: Dayjs): number => {
  const pos1 = _date1
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0);
  const pos2 = _date2
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0);
  return pos1.diff(pos2, "days");
};

export { getDateDiff };
