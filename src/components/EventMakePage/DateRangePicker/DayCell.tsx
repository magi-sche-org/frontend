import type { SxProps } from "@mui/material";
import { Button } from "@mui/material";
import type { Theme } from "@mui/system";
import { Stack } from "@mui/system";
import type { Dayjs } from "dayjs";
import type { FC } from "react";

import type { CalenderItemType } from "@/@types/calender";
import { theme } from "@/theme/theme";

const PRIMARYLIGHT = theme.palette.primary.light;

type Props = {
  calenderItem: CalenderItemType;
  handleSelectDay: (day: Dayjs) => void;
  isUndefinedSelectedDay: boolean;
  isSameDay: boolean;
};

/**
 * カレンダーの日付部分の１マス
 *
 * @param calenderArray カレンダーのデータ
 * @param handleSelectDay カレンダーの日付を選択した時のhandler
 * @param isUndefinedSelectedDay 開始日・終了日が選択されているかどうか
 */
export const DayCell: FC<Props> = ({
  calenderItem,
  handleSelectDay,
  isUndefinedSelectedDay,
  isSameDay,
}) => {
  const { day, isThisMonthDay, isStarted, isEnded, isBetween } = calenderItem;
  const isSelected = isStarted || isEnded;

  const bgcolor = (() => {
    if (isSelected) {
      return "primary.main";
    }
    if (isBetween) {
      return "primary.light";
    }
    return "";
  })();
  const stackBgColor = (() => {
    if (isBetween) {
      return "primary.light";
    }
    return "";
  })();
  const backgroundImage = (() => {
    if (isUndefinedSelectedDay || isSameDay) {
      return "";
    }
    if (isStarted) {
      return `linear-gradient(to right, white 50%, ${PRIMARYLIGHT} 50%)`;
    }
    if (isEnded) {
      return `linear-gradient(to right, ${PRIMARYLIGHT} 50%, white 50%)`;
    }
    return "";
  })();
  const borderRadius =
    isUndefinedSelectedDay || isStarted || isEnded ? "100%" : 0;
  const color = isSelected ? "white" : "black";
  const opacity = isThisMonthDay ? 1 : 0;
  const disabled = !isThisMonthDay;
  const zIndex = isSelected ? 1 : 0;

  const styles: SxProps<Theme> = {
    bgcolor: bgcolor,
    color: color,
    opacity: opacity,
    borderRadius: borderRadius,
    zIndex: zIndex,
    aspectRatio: 1,
  };

  const stylesObj: SxProps<Theme> = {
    minWidth: "50px",
    ...styles,
    "&:hover": {
      ...styles,
      opacity: opacity - 0.1,
    },
  };

  const stackStyles: SxProps<Theme> = {
    bgcolor: stackBgColor,
    backgroundImage: backgroundImage,
  };

  return (
    <Stack alignItems="center" sx={stackStyles}>
      <Button
        disabled={disabled}
        sx={stylesObj}
        size="small"
        onClick={() => handleSelectDay(day)}
      >
        {day.format("D")}
      </Button>
    </Stack>
  );
};
