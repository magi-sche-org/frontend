import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import type { FC } from "react";
import { useState } from "react";

import type { TSchedule } from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";
import { CalendarWrapper } from "@/components/calendar/timeline-wrapper";

import Styles from "./CalendarRangePicker.module.scss";

type Props = {
  schedules?: TSchedule[];
  selectedRanges: TSelectionRange[];
  dispatchOnChange: (range: TSelectionRange, isAdd: boolean) => void;
};

const CalendarRangePicker: FC<Props> = ({
  selectedRanges,
  schedules,
  dispatchOnChange,
}) => {
  const [isAdd, setIsAdd] = useState(true);
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.toolbar}>
        <div className={`${Styles.toggle} ${isAdd && Styles.active}`}>
          <IconButton className={Styles.on} onClick={() => setIsAdd(true)}>
            <PlaylistAddIcon />
          </IconButton>
          <IconButton className={Styles.off} onClick={() => setIsAdd(false)}>
            <PlaylistRemoveIcon />
          </IconButton>
        </div>
      </div>
      <CalendarWrapper
        count={7}
        startDate={dayjs()}
        selectedRanges={selectedRanges}
        schedules={schedules}
        dispatchOnChange={(...args) => dispatchOnChange(...args, isAdd)}
        selectingColor={
          isAdd ? "rgba(0, 255, 255, 0.2)" : "rgba(255, 0, 0, 0.2)"
        }
      />
    </div>
  );
};

export { CalendarRangePicker };
