import {
  IAvailability,
  IEventTimeDuration,
  IHourOfDay,
} from "@/@types/api/event";
import { FC, useState } from "react";
import { Dayjs } from "dayjs";

import { createProposedStartTimeList } from "@/libraries/proposedStartTime";
import { InputSchedule } from "./InputSchedule";

type Props = {
  startDay: Dayjs;
  endDay: Dayjs;
  startTime: IHourOfDay;
  endTime: IHourOfDay;
  eventTimeDuration: IEventTimeDuration;
};

export type IAnswerList = {
  // key: Dayjsをstring化したもの
  [unitStartTime: string]: IAvailability;
};
export const CandidateDatePreview: FC<Props> = ({
  startDay,
  endDay,
  startTime,
  endTime,
  eventTimeDuration,
}) => {
  const [checkList, setCheckList] = useState<IAnswerList>(() => {
    // 与えられた情報から候補日の開始時間を決定し、checkListを初期化
    const startTimeList: string[] = createProposedStartTimeList(
      startDay,
      endDay,
      // timePaddingではなく
      eventTimeDuration,
      eventTimeDuration,
      startTime,
      endTime,
    );
    const initialCheckList: IAnswerList = {};
    startTimeList.forEach((v) => {
      initialCheckList[v] = "available";
    });
    return initialCheckList;
  });
  return (
    <>
      <InputSchedule
        eventTimeDuration={eventTimeDuration}
        checkList={checkList}
        setCheckList={(newCheckList) => setCheckList(newCheckList)}
      />
    </>
  );
};
