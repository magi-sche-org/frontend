import { typeGuard } from "@/libraries/typeGuard";
import { generateUuid } from "@/libraries/uuid";
import { gcp_clientId, gcp_redirectUri, gcp_scopes } from "@/libraries/gcpEnv";

const baseUri = "https://accounts.google.com/o/oauth2/v2/auth";
const getLoginUrl = (state: string) =>
	`${baseUri}?client_id=${gcp_clientId}&scope=${gcp_scopes}&redirect_uri=${gcp_redirectUri}&state=${state}&prompt=consent&response_type=token&include_granted_scopes=true&enable_serial_consent=true&service=lso&o2v=2&flowName=GeneralOAuthFlow`;

const login = () => {
	const uuid = generateUuid();
	localStorage.setItem("gcp_state", uuid);
	location.href = getLoginUrl(uuid);
};

const parseToken = () => {
	const data = location.hash
		.slice(1)
		.split("&")
		.reduce((pv, string) => {
			const [key, value] = string.split("=");
			pv[key] = decodeURI(value);
			return pv;
		}, {} as { [key: string]: string }) as unknown;
	if (
		!typeGuard.AuthorizationTokens(data) ||
		data.state !== localStorage.getItem("gcp_state")
	) {
		throw new Error("Invalid oauth response");
	}
	localStorage.setItem("gcp_token", data.access_token);
};

export { login, parseToken };
