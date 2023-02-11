const gcp_apiKey = process.env.NEXT_PUBLIC_GCP_API_KEY;
const gcp_clientId = process.env.NEXT_PUBLIC_GCP_CLIENT_ID;
const gcp_scopes = JSON.parse(process.env.NEXT_PUBLIC_GCP_SCOPES || "[]")
	.map((val: string) => encodeURIComponent(val))
	.join(" ");
const gcp_redirectUri = process.env.NEXT_PUBLIC_GCP_REDIRECT_URI;
export { gcp_apiKey, gcp_clientId, gcp_scopes, gcp_redirectUri };
