import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import calenderData from "./calenderData.json";

export const UserCalender = () => {
  return (
    <Stack
      sx={{ p: 3, pb: 0.5, bgcolor: "primary.main" }}
      style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%" }}
    >
      <Stack direction="row" spacing={1}>
        {calenderData.map((calenderInfo) => {
          return (
            <Stack
              key={calenderInfo.id}
              direction="column"
              spacing={0.5}
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                minwidth: "120px",
                height: "120px",
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ textAlign: "center" }}>
                {calenderInfo.dayNum}
              </Typography>
              {calenderInfo.schedule.map((scheduleInfo) => {
                return (
                  <Stack
                    key={scheduleInfo.id}
                    sx={{
                      border: "solid",
                      borderWidth: 1,
                      borderRadius: 1,
                      borderColor: "primary.main",
                      bgcolor: "white",
                      p: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "primary.main", lineHeight: "1.2" }}
                    >
                      {scheduleInfo.eventTitle}
                      <br />
                      {scheduleInfo.startTime}時〜{scheduleInfo.endTime}時
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
