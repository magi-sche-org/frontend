import type { SelectChangeEvent } from "@mui/material";
import { MenuItem, Select } from "@mui/material";
import { useEffect } from "react";

const timeList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

type Props = {
  time: number;
  handleTime: (time: number) => void;
  underTime?: number;
};

/**
 *  時間選択コンポーネント
 *
 *  @param time 選択されている時間
 *  @param handleTime 時間を更新するhandler
 *  @param underTime 以下の時間を選択できないようにする
 */
export const TimeSelect = ({ time, handleTime, underTime }: Props) => {
  // 開始時間よりも前の時間を選択できないようにする
  const editTimeList = underTime
    ? timeList.filter((item) => {
        return item > underTime;
      })
    : timeList;

  const isNonItem = editTimeList.length === 0;

  // 開始時間よりも前の時間を選択を選択した場合、開始時間+1に合わせる
  useEffect(() => {
    if (underTime && time < underTime) {
      handleTime(isNonItem ? underTime : underTime + 1);
    }
  }, [underTime]);

  return (
    <Select
      value={String(time)}
      variant="standard"
      onChange={(e: SelectChangeEvent) => {
        handleTime(Number(e.target.value));
      }}
      sx={{
        minWidth: 80,
      }}
    >
      {!isNonItem ? (
        editTimeList.map((timeInfo) => {
          return (
            <MenuItem key={timeInfo} value={timeInfo}>
              {timeInfo}
            </MenuItem>
          );
        })
      ) : (
        <MenuItem value={24}>{24}</MenuItem>
      )}
    </Select>
  );
};
