const requests = async<T>(url: RequestInfo | URL, init?: RequestInit | undefined, type:"json"|"text"="json"): Promise<T> => {
  const req = await fetch(url,{credentials: "include", ...init});
  return type === "json" ? await req.json() : await req.text();
}

export { requests };