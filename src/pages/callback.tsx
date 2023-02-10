import {parseToken} from "@/libraries/authorization";
import {useEffect, useState} from "react";

const Callback = () => {
  const [message,setMessage] = useState("");
  useEffect(()=>{
    if (typeof window === "object") {
      try {
        parseToken();
      }catch (e){
        setMessage(`encountered the following error:\n${e}`);
      }
    }
  },[setMessage])
  return <>
    {message && <pre><code>{message}</code></pre>}
  </>;
}
export default Callback;