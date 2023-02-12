import type { AuthorizationTokens } from "@/@types/authorization";
import type {
  DateSchedule,
  DateTimeSchedule,
  EventDate,
  EventDateTime,
  Schedule,
  ScheduleResponse
} from "@/@types/event";
import type { userInfo } from "@/@types/userInfo";
import { ApiError } from "@/@types/error";

const typeGuard = {
  AuthorizationTokens: (i: unknown): i is AuthorizationTokens =>
    typeof i === "object" &&
    objectVerify(i, ["access_token", "authuser", "expires_in", "prompt", "scope", "token_type"]) &&
    (i as AuthorizationTokens).prompt === "consent" &&
    (i as AuthorizationTokens).token_type === "Bearer",
  ScheduleResponse: (i: unknown): i is ScheduleResponse =>
    typeof i === "object" &&
    objectVerify(i, ["accessRole", "defaultReminders", "etag", "items", "kind", "summary", "timeZone", "updated"]),
  userInfo: (i: unknown): i is userInfo =>
    typeof i === "object" && objectVerify(i, ["id", "email", "verified_email", "picture"]),
  errorResponse: (i: unknown): i is ApiError => typeof i === "object" && objectVerify(i, ["error"]),
  DateTimeSchedule: (i: unknown): i is DateTimeSchedule =>
    typeof i === "object" && objectVerify((i as Schedule).start,["dateTime","timeZone"]),
  DateSchedule: (i: unknown): i is DateSchedule =>
    typeof i === "object" && objectVerify((i as Schedule).start, ["date"])
};

const objectVerify = (item: unknown, keys: string[]): boolean => {
  if (typeof item !== "object" || !item) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
  }
  return true;
};

export { typeGuard };
