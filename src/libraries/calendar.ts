import { requests } from "@/libraries/requests";
import { typeGuard } from "@/libraries/typeGuard";
import { Schedule } from "@/@types/event";

const baseUri =
	"https://www.googleapis.com/calendar/v3/calendars/primary/events";
const apiKey = process.env.NEXT_PUBLIC_GCP_API_KEY;
const getRequestUrl = (timeMin: Date, maxResults: number) =>
	`${baseUri}?singleEvents=true&maxResults=${maxResults}&orderBy=startTime&timeMin=${timeMin.toISOString()}&showDeleted=false&key=${apiKey}`;

const getSchedules = async (timeMin: Date): Promise<Schedule[]> => {
	const req = await requests(getRequestUrl(timeMin, 100));
	const res = (await req.json()) as unknown;
	if (!typeGuard.ScheduleResponse(res)) {
		throw new Error("invalid response");
	}
	return res.items;
};
export { getSchedules };
