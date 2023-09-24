import { IRequestResult, IRequestSuccess } from "@/@types/api/request";
import { ApiError } from "@/@types/error";
import type {
  AuthorizationError,
  AuthorizationTokens,
} from "@/@types/legacy-authorization";
import type { userInfo } from "@/@types/userInfo";

import type { IEventTimeDuration, IHourOfDay } from "../@types/api/event";
import { EventTimeDuration, HourOfDay } from "../constants/event";

const typeGuard = {
  AuthorizationTokens: (i: unknown): i is AuthorizationTokens =>
    typeof i === "object" &&
    objectVerify(i, [
      "access_token",
      "authuser",
      "expires_in",
      "prompt",
      "scope",
      "token_type",
    ]) &&
    (i as AuthorizationTokens).prompt === "consent" &&
    (i as AuthorizationTokens).token_type === "Bearer",
  AuthorizationError: (i: unknown): i is AuthorizationError =>
    typeof i === "object" && objectVerify(i, ["error", "state"]),
  userInfo: (i: unknown): i is userInfo =>
    typeof i === "object" &&
    objectVerify(i, ["id", "email", "verified_email", "picture"]),
  errorResponse: (i: unknown): i is ApiError =>
    typeof i === "object" && objectVerify(i, ["error"]),
  HourOfDay: (v: number): v is IHourOfDay =>
    // TODO: これどーすんの
    (HourOfDay as unknown as number[]).includes(v),
  EventTimeDuration: (v: number): v is IEventTimeDuration =>
    (EventTimeDuration as unknown as number[]).includes(v),
  RequestSuccess: <T>(i: unknown): i is IRequestSuccess<T> =>
    typeof i === "object" &&
    objectVerify(i, ["statusCode"]) &&
    (i as IRequestResult<unknown>).statusCode == 200 &&
    (i as IRequestResult<unknown>).statusCode == 201,
};

const objectVerify = (item: unknown, keys: string[]): boolean => {
  if (typeof item !== "object" || !item) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
  }
  return true;
};

export { typeGuard };
