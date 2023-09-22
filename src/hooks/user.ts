import { useEffect, useRef, useState } from "react";
import { User } from "@/@types/user";
import { requests } from "@/libraries/requests";
import { IRequestResult } from "@/@types/api/request";

const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    void (async () => {
      setUser(await getUser());
    })();
  }, []);
  return user;
};

const getUser = async (count = 0): Promise<User> => {
  const user = await requests<IRequestResult<User>>("/user");
  if (user.statusCode !== 200) {
    if (count > 3) {
      throw "failed to get user data";
    }
    await requests("/token", { method: "POST" });
    return await getUser(++count);
  }
  return user.data;
};

export { useUser };
