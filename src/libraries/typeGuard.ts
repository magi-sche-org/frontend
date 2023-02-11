import { AuthorizationTokens } from "@/@types/authorization";
import { ScheduleResponse } from "@/@types/event";

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
	ScheduleResponse: (i: unknown): i is ScheduleResponse =>
		typeof i === "object" &&
		objectVerify(i, [
			"accessRole",
			"defaultReminders",
			"etag",
			"items",
			"kind",
			"summary",
			"timeZone",
			"updated",
		]),
};

const objectVerify = (item: unknown, keys: string[]): boolean => {
	if (typeof item !== "object" || !item) return false;
	for (const key of keys) {
		if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
	}
	return true;
};

export { typeGuard };
