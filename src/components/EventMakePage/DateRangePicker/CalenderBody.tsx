import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { Dayjs } from "dayjs";
import { FC } from "react";

import { CalenderItemType } from "@/@types/calender";

import { DayCell } from "./DayCell";

type Props = {
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
export const CalenderBody: FC<Props> = ({
  calenderArray,
  handleSelectDay,
  isUndefinedSelectedDay,
  isSameDay,
}) => {
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
