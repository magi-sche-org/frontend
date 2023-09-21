import { Schedule } from "@/@types/event";
import { getSchedules } from "@/libraries/calendar";
import { typeGuard } from "@/libraries/typeGuard";
import { IAnswerList } from "@/pages/preview";
import { useEffect, useState } from "react";

export const useSchedule = () => {
  const [schedules, setSchedules] = useState<
    { [key: string]: Schedule[] } | undefined | null
  >(undefined);
  useEffect(() => {
    if (typeof window !== "object") return;
    (async () => {
      try {
        const raw = await getSchedules(new Date());
        const data = raw.reduce(
          (pv, val) => {
            const date = new Date(
              typeGuard.DateTimeSchedule(val)
                ? val.start.dateTime
                : val.start.date,
            );
            const key = `${date.getMonth() + 1}/${date.getDate()}`;
            if (!pv[key]) {
              pv[key] = [];
            }
            pv[key].push(val);
            return pv;
          },
          {} as { [key: string]: Schedule[] },
        );
        setSchedules(data);
      } catch (e) {
        setSchedules(null);
      }
    })();
  }, [setSchedules]);
  return { schedules, setSchedules };
};
