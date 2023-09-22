import { useEffect, useState } from "react";
import { User } from "@/@types/user";
import { requests } from "@/libraries/requests";
import { IRequestResult } from "@/@types/api/request";

const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
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
