import { gcp_apiKey } from "@/libraries/gcpEnv";
import { requests } from "@/libraries/requests";
import { typeGuard } from "@/libraries/typeGuard";

import type { userInfo } from "@/@types/userInfo";

const baseUri = "https://content.googleapis.com/oauth2/v2/userinfo";
const requestUrl = `${baseUri}?key=${gcp_apiKey}`;

const getUserInfo = async (): Promise<userInfo> => {
	const req = await requests(requestUrl);
	const res = (await req.json()) as unknown;
	if (!typeGuard.userInfo(res)) {
		throw new Error("invalid response");
	}
	return res;
};
