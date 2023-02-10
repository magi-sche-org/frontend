import {AuthorizationTokens} from "@/@types/authorization";

const typeGuard = {
  AuthorizationTokens: (i: unknown): i is AuthorizationTokens =>
    typeof i === "object"
    && objectVerify(i,["access_token","authuser","expires_in","prompt","scope","token_type"])
    && (i as AuthorizationTokens).prompt === "consent"
    && (i as AuthorizationTokens).token_type === "Bearer"
}

const objectVerify = (item: unknown, keys: string[]): boolean => {
  if (typeof item !== "object" || !item) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
  }
  return true;
};

export {typeGuard};