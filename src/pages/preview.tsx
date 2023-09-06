import { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { CandidateDatePreview } from "@/components/EventMakePage/CandidateDatePreview";
import { typeGuard } from "@/libraries/typeGuard";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Checkbox, Input, TextField } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { useSchedule } from "@/hooks/useSchedule";
import { UserCalender } from "@/components/GuestPage/UserCalender";

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
      <TextField
        label="イベント名"
        variant="outlined"
        value={eventName}
        onChange={(e) => {
          setEventName(e.target.value);
        }}
      />
      <CandidateDatePreview
        startDay={startDay}
        endDay={endDay}
        startTime={startTime}
        endTime={endTime}
        eventTimeDuration={eventTimeDuration}
      />
      <TextField
        label="イベント名"
        variant="outlined"
        value={eventName}
        onChange={(e) => {
          setEventName(e.target.value);
        }}
      />
      <Checkbox
        size="medium"
        onChange={(_, checked) => {
          setIsConfirmNotice(checked);
        }}
        checked={isConfirmNotice}
      />
      <div>確定通知をする</div>
      <div>
        参加人数
        <TextField
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={participantsCount}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!v) {
              return;
            }
            setParticipantsCount(v);
          }}
        />
        人
      </div>
      <TextField
        label="確定通知用メールアドレス"
        variant="outlined"
        value={emailAddress}
        onChange={(e) => {
          setEmailAddress(e.target.value);
        }}
      />
    </>
  );
}
