import { parseToken } from "@/libraries/authorization";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      if (typeof window === "object") {
        try {
          await parseToken();
          const url = localStorage.getItem("gcp_state")||"/";
          localStorage.removeItem("gcp_state");
          await router.replace(url);
        } catch (e) {
          setMessage(`encountered the following error:\n${e}`);
        }
      }
    })();
  }, [setMessage, router]);
  return (
    <>
      {message && (
        <pre>
          <code>{message}</code>
        </pre>
      )}
    </>
  );
};
export default Callback;
