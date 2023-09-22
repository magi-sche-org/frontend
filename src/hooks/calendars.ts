import { useUser } from "@/hooks/user";
import { requests } from "@/libraries/requests";
import { IRequestResult } from "@/@types/api/request";
import {
  UserCalendarProvider,
  UserCalendarResponseProvider,
} from "@/@types/calender";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { generateUuid } from "@/libraries/uuid";

const useCalendars = (): {
  calendars?: UserCalendarProvider[];
  refresh: () => void;
} => {
  const user = useUser();
  const ref = useRef(false);
  const [calendars, setCalendars] = useState<
    UserCalendarResponseProvider[] | undefined
  >(undefined);

  const updateCalendars = () => {
    void (async () => {
      const calendars = await requests<
        IRequestResult<UserCalendarResponseProvider[]>
      >("/user/external/calendars");
      if (calendars.statusCode !== 200) return;
      setCalendars(calendars.data);
    })();
  };

  useEffect(() => {
    if (!user || ref.current) {
      return;
    }
    ref.current = true;
    updateCalendars();
  }, [user]);

  if (!calendars) return { refresh: updateCalendars };

  const result = calendars.map((provider) => {
    return {
      ...provider,
      events: provider.events.map((schedule) => {
        if (schedule.startTime === null) {
          return {
            ...schedule,
            start: dayjs(`${schedule.startDate}T00:00:00+09:00`),
            end: dayjs(`${schedule.endDate}T00:00:00+09:00`),
            id: generateUuid(),
          };
        }
        return {
          ...schedule,
          start: dayjs(schedule.startTime),
          end: dayjs(schedule.endTime),
          id: generateUuid(),
        };
      }),
    };
  });

  return { calendars: result, refresh: updateCalendars };
};

export { useCalendars };
