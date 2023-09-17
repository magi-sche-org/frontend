import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

const Callback = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      if (typeof window === "object") {
        try {
          //todo: temporary codeをバックエンドに投げる
          enqueueSnackbar(`ログインしました`, {
            autoHideDuration: 5000,
            variant: "success",
          });
        } catch (e) {
          if (e === "Error: login failed") {
            enqueueSnackbar(`ログインに失敗しました`, {
              autoHideDuration: 10000,
              variant: "error",
            });
          } else {
            enqueueSnackbar(`${e}`, {
              autoHideDuration: 10000,
              variant: "error",
            });
          }
          const url = localStorage.getItem("redirect_url") ?? "/";
          localStorage.removeItem("redirect_url");
          await router.replace(url);
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
