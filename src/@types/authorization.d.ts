export type AuthorizationTokens = {
  access_token: string;
  authuser: number;
  expires_in: number;
  prompt: "consent";
  scope: string;
  token_type: "Bearer";
  state: string;
}