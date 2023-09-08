import { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { CandidateDatePreview } from "@/components/EventMakePage/CandidateDatePreview";
import { typeGuard } from "@/libraries/typeGuard";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useSchedule } from "@/hooks/useSchedule";
import { UserCalender } from "@/components/GuestPage/UserCalender";
import { Stack } from "@mui/system";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export type IAnswerList = {
  // key: Dayjsをstring化したもの
  [unitStartTime: string]: boolean;
};

//http://localhost:3000/preview?startday=2023-09-01&endday=2023-09-03&starttime=11&endtime=13&eventtimeduration=1800
export default function Home() {
  const searchParams = useSearchParams();
  const { schedules } = useSchedule();
  // searchParamsが変わった時にのみ再取得
  const { startDay, endDay, startTime, endTime, eventTimeDuration } =
    useMemo(() => {
      const startDay = dayjs(searchParams.get("startday"));
      const endDay = dayjs(searchParams.get("endday"));
      const startTime = Number(searchParams.get("starttime"));
      const endTime = Number(searchParams.get("endtime"));
      const eventTimeDuration = Number(searchParams.get("eventtimeduration"));
      return {
        startDay,
        endDay,
        startTime,
        endTime,
        eventTimeDuration,
      };
    }, [searchParams]);

  // イベント名
  const [eventName, setEventName] = useState("");
  // 確定通知
  const [isConfirmNotice, setIsConfirmNotice] = useState(false);
  // 参加人数
  const [participantsCount, setParticipantsCount] = useState<number>();
  // 確定通知用メールアドレス
  const [emailAddress, setEmailAddress] = useState("");
  if (
    !typeGuard.HourOfDay(startTime) ||
    !typeGuard.HourOfDay(endTime) ||
    !typeGuard.EventTimeDuration(eventTimeDuration) ||
    !startDay ||
    !endDay
  ) {
    return <div>不正なパラメータが送られています。</div>;
  }
  return (
    <>
      {schedules && <UserCalender schedules={schedules} />}
      <Stack
        sx={{
          p: 3,
          mb: 3,
        }}
        spacing={5}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          作成プレビュー
        </Typography>
        <FormControl variant="outlined">
          <InputLabel>イベント名</InputLabel>
          <OutlinedInput
            type="text"
            autoFocus
            value={eventName}
            onChange={(e) => {
              setEventName(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setEventName("");
                  }}
                >
                  <HighlightOffIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <CandidateDatePreview
          startDay={startDay}
          endDay={endDay}
          startTime={startTime}
          endTime={endTime}
          eventTimeDuration={eventTimeDuration}
        />
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="h5">日付確定通知</Typography>
            <Typography>
              指定人数以上の回答があった場合に、メールに日付の確定通知を行います。
            </Typography>
          </Stack>
          <FormGroup>
            <FormControlLabel
              label="日程確定通知をする"
              control={
                <Checkbox
                  size="medium"
                  checked={isConfirmNotice}
                  onChange={(_, checked) => {
                    setIsConfirmNotice(checked);
                  }}
                />
              }
              sx={{ mb: 1 }}
            />
            <FormControl>
              <InputLabel>参加人数</InputLabel>
              <OutlinedInput
                type="number"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*|" }}
                endAdornment={
                  <InputAdornment position="end">人</InputAdornment>
                }
                value={participantsCount}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!v) {
                    return;
                  }
                  setParticipantsCount(v);
                }}
                sx={{ ml: 0, mb: 2 }}
              />
            </FormControl>
            <TextField
              type="email"
              label="確定通知用メールアドレス"
              variant="outlined"
              value={emailAddress}
              onChange={(e) => {
                setEmailAddress(e.target.value);
              }}
            />
          </FormGroup>
        </Stack>
        <Button variant="contained">作成する</Button>
      </Stack>
    </>
  );
}
