import { GetEventResponse } from "../../service/api-client/protocol/event_pb";

type EventScheduleUnit = {
  key: string;
  startTime: Date;
  endTime: Date;
};
export const createProposedScheduleList: (
  eventDetail: GetEventResponse.AsObject
) => EventScheduleUnit[] = (eventDetail: GetEventResponse.AsObject) => {
  // TODO: ほんとはこうやって処理したい
  // const proposedScheduleList = eventDetail.proposedstarttimeList.map(() => {});
  const proposedScheduleList = eventDetail.proposedstarttimeList.map((_, i) => {
    // TODO: ここで、
    // 1. Timestampからdateに変換
    // 2. date + durationをして、endTimeを計算
    const startTime = new Date();
    const endTime = new Date();
    startTime.setDate(startTime.getDate() - i);
    return { key: String(i), startTime, endTime };
  });

  return proposedScheduleList;
};
