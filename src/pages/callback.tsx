import { parseToken } from "@/libraries/authorization";
import { useEffect, useState } from "react";
import {useRouter} from "next/router";

const Callback = () => {
	const router = useRouter();
	const [message, setMessage] = useState("");
	useEffect(() => {
		(async()=>{
			if (typeof window === "object") {
				try {
					await parseToken();
					await router.replace("/")
				} catch (e) {
					setMessage(`encountered the following error:\n${e}`);
				}
			}
		})();
	}, [setMessage]);
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
