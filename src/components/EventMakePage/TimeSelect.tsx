import type { SelectChangeEvent } from "@mui/material";
import { MenuItem, Select } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";

import type { IHourOfDay } from "@/@types/api/event";
import { HourOfDay } from "@/constants/event";

type Props = {
  time: number;
  handleTime: (time: number) => void;
  underTime?: number;
  upperTime?: number;
};

const timeFilter = (underTime?: number, upperTime?: number): IHourOfDay[] => {
  const newUnderTime = underTime ?? 0;
  const newUpperTime = upperTime ?? 24;
  return HourOfDay.filter((i) => newUpperTime >= i && i >= newUnderTime);
};

/**
 *  時間選択コンポーネント
 *
 *  @param time 選択されている時間
 *  @param handleTime 時間を更新するhandler
 *  @param underTime 選択できる時間の下限
 *  @param upperTime 選択できる時間の上限
 */
export const TimeSelect: FC<Props> = ({
  time,
  handleTime,
  underTime,
  upperTime,
}) => {
  // 条件に合った時間の候補を取得
  const editTimeList = timeFilter(underTime, upperTime);

  // 下限が変更された場合、値を下限+1に設定しなおす
  useEffect(() => {
    if (underTime && time < underTime) {
      handleTime(underTime + 1);
    }
  }, [underTime]);

  // 上限が変更された場合、値を上限に設定しなおす
  useEffect(() => {
    if (upperTime && time >= upperTime) {
      handleTime(upperTime);
    }
  }, [upperTime]);
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
      {editTimeList.map((timeInfo) => {
        return (
          <MenuItem key={timeInfo} value={timeInfo}>
            {timeInfo}
          </MenuItem>
        );
      })}
    </Select>
  );
};
