import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { FC, useState } from "react";

export const DateRangePicker: FC = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <>
      <Calendar
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
      />
    </>
  );
};
