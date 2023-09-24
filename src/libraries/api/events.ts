import type { IEvent, IUserAnswerUnit } from "@/@types/api/event";
import type { IRequestResult } from "@/@types/api/request";
import { requests } from "@/libraries/requests";
import { typeGuard } from "@/libraries/typeGuard";

const createEvent = async (
  name: string,
  description: string,
  duration: number,
  units: string[],
  isNotification: boolean,
  email: string | undefined,
  participantsNumber: number | undefined,
) => {
  const body = {
    name,
    description,
    unitDuration: duration,
    units: units.map((unit) => ({ startsAt: unit })),
    enablesEmailNotification: isNotification,
    expectedParticipantsNumber: participantsNumber ?? undefined,
    notificationEmail: email ?? undefined,
  };
  const res = await requests<IRequestResult<IEvent>>("/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!typeGuard.RequestSuccess(res)) throw new Error(res.message);
  return res.data;
};

const createAnswer = async (
  eventId: string,
  name: string,
  note: string,
  units: IUserAnswerUnit[],
) => {
  const body = {
    userNickname: name,
    note,
    units,
  };
  const res = await requests<IRequestResult<IEvent>>(
    `/events/${eventId}/user/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!typeGuard.RequestSuccess(res)) throw new Error(res.message);
  return res.data;
};

export { createAnswer, createEvent };
