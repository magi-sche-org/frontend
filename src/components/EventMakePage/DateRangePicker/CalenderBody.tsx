import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import type { Dayjs } from "dayjs";

import type { CalenderItemType } from "@/@types/calender";

import { DayCell } from "./DayCell";

type props = {
  calenderArray: CalenderItemType[][];
  handleSelectDay: (day: Dayjs) => void;
  isUndefinedSelectedDay: boolean;
  isSameDay: boolean;
};

/**
 * カレンダーの日付部分を表示
 *
 * @param calenderArray カレンダーのデータ
 * @param handleSelectDay カレンダーの日付を選択した時のhandler
 * @param isUndefinedSelectedDay 開始日・終了日が選択されているかどうか
 */
export const CalenderBody = ({
  calenderArray,
  handleSelectDay,
  isUndefinedSelectedDay,
  isSameDay,
}: props) => {
  return (
    <Stack>
      {calenderArray.map((week, index) => {
        const key = week[index].day.format("YYYY-MM-DD");
        return (
          <Grid container key={key} justifyContent="center" columns={7}>
            {week.map((day) => {
              const key = day.day.format("YYYY-MM-DD");
              return (
                <Grid key={key} item xs={1}>
                  <DayCell
                    calenderItem={day}
                    handleSelectDay={handleSelectDay}
                    isUndefinedSelectedDay={isUndefinedSelectedDay}
                    isSameDay={isSameDay}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      })}
    </Stack>
  );
};
