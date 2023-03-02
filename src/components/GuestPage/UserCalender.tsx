import { IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Schedule } from "@/@types/event";
import { typeGuard } from "@/libraries/typeGuard";
import { date2time } from "@/libraries/time";

type userCalendar = {
  schedules: { [key: string]: Schedule[] };
};

export const UserCalender = ({ schedules }: userCalendar) => {
  const [CalenderBarOpen, setCalenderBarOpen] = useState<boolean>(true);
  return (
    <>
      {CalenderBarOpen && (
        <Stack
          sx={{ p: 3, pt: 1, pb: 0.5, bgcolor: "primary.main" }}
          style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%" }}
        >
          <Stack direction='row' spacing={1}>
            {Object.keys(schedules).length === 0 && (
              <Stack
                direction='column'
                spacing={0.5}
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  width: "100%",
                  height: "120px",
                  p: 2
                }}
              >
                <Typography variant='caption' sx={{ textAlign: "center" }}>
                  直近の予定はありません
                </Typography>
              </Stack>
            )}
            {Object.keys(schedules).map((date) => {
              return (
                <Stack
                  key={date}
                  direction='column'
                  spacing={0.5}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 3,
                    minWidth: "130px",
                    height: "130px",
                    p: 2
                  }}
                >
                  <Typography variant='caption' sx={{ textAlign: "center" }}>
                    {date}
                  </Typography>
                  {schedules[date].map((schedule) => {
                    const duration = (() => {
                      if (typeGuard.DateTimeSchedule(schedule)) {
                        const start = new Date(schedule.start.dateTime);
                        const end = new Date(schedule.end.dateTime);
                        return (
                          <>
                            {date2time(start)}~{date2time(end)}
                          </>
                        );
                      }
                      return <>終日</>;
                    })();
                    return (
                      <Stack
                        key={schedule.id}
                        sx={{
                          border: "solid",
                          borderWidth: 1,
                          borderRadius: 1,
                          borderColor: "primary.main",
                          bgcolor: "white",
                          p: 0.5
                        }}
                      >
                        <Typography
                          variant='caption'
                          sx={{ color: "primary.main", lineHeight: "1.2" }}
                        >
                          {duration}
                          <br />
                          {schedule.summary}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      )}
      <Stack direction='row' justifyContent='center' sx={{ bgcolor: "primary.main", pb: 0.5 }}>
        <IconButton
          onClick={() => {
            setCalenderBarOpen(!CalenderBarOpen);
          }}
        >
          {CalenderBarOpen ? (
            <ExpandLessIcon sx={{ color: "secondary.main" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "secondary.main" }} />
          )}
        </IconButton>
      </Stack>
    </>
  );
};
