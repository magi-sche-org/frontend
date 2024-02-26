import { useEffect, useRef, useState } from "react";

import type { IRequestResult } from "@/@types/api/request";
import type { User } from "@/@types/user";
import { requests } from "@/libraries/requests";

const useUser = (): { user?: User; logout: () => void; update: () => void } => {
  const [user, setUser] = useState<User | undefined>();
  const ref = useRef(false);
  const update = (): void => {
    void (async () => {
      setUser(await getUser());
    })();
  };
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    update();
  }, []);
  const logout = (): void => {
    void requests("/logout", { method: "POST" }).then(() => {
      location.reload();
    });
  };
  return { user, logout, update };
};

const getUser = async (count = 0): Promise<User> => {
  const user = await requests<IRequestResult<User>>("/user");
  if (user.statusCode !== 200) {
    if (count > 3) {
      throw new Error("failed to get user data");
    }
    await requests("/token", { method: "POST" });
    return await getUser(++count);
  }
  return user.data;
};

export { useUser };
