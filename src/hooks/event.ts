import { useEffect, useState } from "react";

import type { IEventResponse } from "@/@types/api/event";
import type { IRequestError, IRequestResult } from "@/@types/api/request";
import { requests } from "@/libraries/requests";
import { typeGuard } from "@/libraries/typeGuard";

const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<IEventResponse | undefined>(undefined);
  const [error, setError] = useState<IRequestError | undefined>(undefined);
  const update = async () => {
    const res = await requests<IRequestResult<IEventResponse>>(
      `/events/${eventId}`,
    );
    if (!typeGuard.RequestSuccess(res)) {
      setError(res);
      setEvent(undefined);
      return;
    }
    setEvent(res.data);
    setError(undefined);
  };
  useEffect(() => {
    void update();
  }, [eventId]);
  return {
    event,
    error,
  };
};

export { useEvent };
