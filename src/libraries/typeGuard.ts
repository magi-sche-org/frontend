import type { IEventTimeDuration, IHourOfDay } from "@/@types/api/event";
import type { IRequestResult, IRequestSuccess } from "@/@types/api/request";
import { EventTimeDuration, HourOfDay } from "@/constants/event";

const typeGuard = {
  HourOfDay: (v: number): v is IHourOfDay =>
    // TODO: これどーすんの
    (HourOfDay as unknown as number[]).includes(v),
  EventTimeDuration: (v: number): v is IEventTimeDuration =>
    (EventTimeDuration as unknown as number[]).includes(v),
  RequestSuccess: <T>(i: unknown): i is IRequestSuccess<T> =>
    typeof i === "object" &&
    objectVerify(i, ["statusCode"]) &&
    ((i as IRequestResult<unknown>).statusCode == 200 ||
      (i as IRequestResult<unknown>).statusCode == 201),
};

const objectVerify = (item: unknown, keys: string[]): boolean => {
  if (typeof item !== "object" || !item) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
  }
  return true;
};

export { typeGuard };
