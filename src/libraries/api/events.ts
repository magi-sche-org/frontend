import { requests } from "@/libraries/requests";
import { IRequestResult } from "@/@types/api/request";
import { IEvent } from "@/@types/api/event";

const createEvent = async (
  name: string,
  description: string,
  duration: number,
  units: string[],
) => {
  const body = {
    name,
    description,
    unitSeconds: duration,
    units: units.map((unit) => ({ startsAt: unit })),
  };
  const res = await requests<IRequestResult<IEvent>>("/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data;
};

const getEvent = async (id: string) => {
  const res = await requests<IRequestResult<IEvent>>(`/events/${id}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data;
};

export { createEvent, getEvent };
