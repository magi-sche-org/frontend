import { CalenderItemType } from "@/@types/calender";
import { theme } from "@/theme/theme";
import { Button, SxProps } from "@mui/material";
import { Stack, Theme } from "@mui/system";
import { Dayjs } from "dayjs";
import { FC } from "react";

const PRIMARYLIGHT = theme.palette.primary.light;

type Props = {
  calenderItem: CalenderItemType;
  handleSelectDay: (day: Dayjs) => void;
  isUndefinedSelectedDay: boolean;
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
  const borderRadius = (() => {
    if (isUndefinedSelectedDay) {
      return "100%";
    }
    if (isStarted) {
      return "100%";
    }
    if (isEnded) {
      return "100%";
    }
    return 0;
  })();
  const backgroundImage = (() => {
    if (isUndefinedSelectedDay) {
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
