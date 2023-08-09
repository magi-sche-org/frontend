const gcpRequests = (url: RequestInfo | URL, init?: RequestInit | undefined) => {
  const key = localStorage.getItem("gcp_token");
  if (!key) {
    throw new Error("token is not set");
  }
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
};
export { gcpRequests };
