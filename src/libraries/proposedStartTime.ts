import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

export const createProposedStartTimeList = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  timePadding: string,
  startTime: number,
  endTime: number
) => {
  if (startDate === undefined || endDate === undefined) {
    return [];
  }
  let addMinutes = 0;
  switch (timePadding) {
    case "30min":
      addMinutes = 30;
      break;
    case "1h":
      addMinutes = 60;
      break;
    case "1day":
      addMinutes = 24 * 60;
      break;
  }
  const dateArray: Date[] = [];
  // 候補日の数
  const candidateDayNum = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  [...Array(candidateDayNum + 1)].map((_, i) => {
    const stCopy: Date = new Date(JSON.parse(JSON.stringify(startDate)));

    stCopy.setHours(startTime);
    // 一応
    stCopy.setMinutes(0);
    stCopy.setSeconds(0);
    stCopy.setDate(stCopy.getDate() + i);

    const edCopy: Date = new Date(JSON.parse(JSON.stringify(stCopy)));
    edCopy.setHours(endTime);
    edCopy.setMinutes(0);
    edCopy.setSeconds(0);

    stCopy.setMinutes(stCopy.getMinutes() + addMinutes);
    // この辺マジでごめんなさい
    // 終了時間がOKだったら、時間分を引いて配列に入れた後、分数を二倍で登録
    while (stCopy <= edCopy) {
      stCopy.setMinutes(stCopy.getMinutes() - addMinutes);
      dateArray.push(new Date(stCopy));
      stCopy.setMinutes(stCopy.getMinutes() + addMinutes * 2);
    }
  });
  return dateArray.map((d) => {
    return Timestamp.fromDate(d);
  });
};
