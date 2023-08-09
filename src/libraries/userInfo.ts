import { gcp_apiKey } from "@/libraries/env";
import { gcpRequests } from "@/libraries/gcpRequests";
import { typeGuard } from "@/libraries/typeGuard";

import type { userInfo } from "@/@types/userInfo";

const baseUri = "https://content.googleapis.com/oauth2/v2/userinfo";
const requestUrl = `${baseUri}?key=${gcp_apiKey}`;

const fetchUserInfo = async (): Promise<userInfo> => {
  const req = await gcpRequests(requestUrl);
  const res = (await req.json()) as unknown;
  if (!typeGuard.userInfo(res)) {
    throw new Error("invalid response");
  }
  return res;
};

const getUserInfo = () => {
  if (typeof window !== "object") return false;
  const data = JSON.parse(localStorage.getItem("gcp_userInfo") || "{}");
  if (typeGuard.userInfo(data)) {
    return data;
  }
  return false;
};

export { fetchUserInfo, getUserInfo };
