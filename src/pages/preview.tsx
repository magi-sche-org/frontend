import HighlightOffIcon from "@mui/icons-material/HighlightOff";
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
import { Stack } from "@mui/system";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import type { IEventTimeDuration, IHourOfDay } from "@/@types/api/event";
import { PageTitle } from "@/components/common/PageTitle";
import { InputSchedule } from "@/components/EventMakePage/InputSchedule";
import { UserCalender } from "@/components/GuestPage/UserCalender";
import { DisplayShareURLModal } from "@/components/preview/share-url";
import { useCalendars } from "@/hooks/calendars";
import { useUser } from "@/hooks/user";
import { createEvent } from "@/libraries/api/events";
import { setEventStorage } from "@/libraries/eventStorage";
import { createProposedStartTimeList } from "@/libraries/proposedStartTime";
import { typeGuard } from "@/libraries/typeGuard";

//http://localhost:3000/preview?startday=2023-09-01&endday=2023-09-03&starttime=11&endtime=13&eventtimeduration=1800
const Preview: FC = () => {
  const searchParams = useSearchParams();
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
  const { calendars } = useCalendars();
  const { user } = useUser();
  // モーダル
  const [showModal, setShowModal] = useState<boolean>(false);
  // 共有用URL
  const [shareURL, setShareURL] = useState("");
  // イベント名
  const [eventName, setEventName] = useState("");
  // イベント説明
  const [eventDescription, setEventDescription] = useState("");
  // 確定通知
  const [isNotification, setIsNotification] = useState(false);
  // 参加人数
  const [participantsNumber, setParticipantsNumber] = useState<string>("");
  // 確定通知用メールアドレス
  const [emailAddress, setEmailAddress] = useState("");
  // 候補日の一覧
  const [startTimeList, setStartTimeList] = useState<Record<string, boolean>>(
    {},
  );
  useEffect(() => {
    if (
      !typeGuard.HourOfDay(startTime) ||
      !typeGuard.HourOfDay(endTime) ||
      !typeGuard.EventTimeDuration(eventTimeDuration) ||
      !startDay ||
      !endDay
    ) {
      return;
    }
    const newStartTimeList = initStartTimeList(
      startDay,
      endDay,
      startTime,
      endTime,
      eventTimeDuration,
    );
    setStartTimeList(newStartTimeList);
  }, [endDay, endTime, eventTimeDuration, startDay, startTime]);

  if (
    !typeGuard.HourOfDay(startTime) ||
    !typeGuard.HourOfDay(endTime) ||
    !typeGuard.EventTimeDuration(eventTimeDuration) ||
    !startDay ||
    !endDay
  ) {
    return <div>不正なパラメータが送られています。</div>;
  }

  const handleSubmit = async (): Promise<void> => {
    // checkedのものだけ抽出
    const filteringStartTimeList = Object.entries(startTimeList)
      .filter(([, checked]) => checked)
      .map(([startTime]) => startTime);
    const response = await createEvent(
      eventName,
      eventDescription,
      eventTimeDuration,
      filteringStartTimeList,
      isNotification,
      emailAddress,
      Number(participantsNumber),
    );

    setEventStorage(response);
    setShareURL(`${location.origin}/guest/${response.id}`);
    setShowModal(true);
  };
  return (
    <>
      {user?.isRegistered && calendars && (
        <UserCalender calendars={calendars} />
      )}
      <Stack
        sx={{
          p: 3,
          mb: 3,
        }}
        spacing={5}
      >
        <PageTitle>作成プレビュー</PageTitle>
        <Stack spacing={2}>
          <Typography variant="h5">イベント情報</Typography>
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
          <TextField
            value={eventDescription}
            onChange={(e) => {
              setEventDescription(e.target.value);
            }}
            rows={2}
            label="イベントの説明"
            variant="outlined"
            multiline
          />
        </Stack>
        <InputSchedule
          eventTimeDuration={eventTimeDuration}
          checkList={startTimeList}
          setCheckList={(newCheckList) => setStartTimeList(newCheckList)}
        />
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="h5">日付確定通知</Typography>
            <Typography>
              指定人数以上の回答があった場合に、メールに日付の確定通知を行います
            </Typography>
          </Stack>
          <FormGroup>
            <FormControlLabel
              label="日程確定通知をする"
              control={
                <Checkbox
                  size="medium"
                  checked={isNotification}
                  onChange={(_, checked) => {
                    setIsNotification(checked);
                  }}
                />
              }
              sx={{ mb: 1 }}
            />
            <FormControl>
              <InputLabel>参加人数</InputLabel>
              <OutlinedInput
                placeholder="3"
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*|",
                }}
                endAdornment={
                  <InputAdornment position="end">人</InputAdornment>
                }
                value={participantsNumber}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v || isNaN(Number(v))) {
                    setParticipantsNumber("");
                    return;
                  }
                  setParticipantsNumber(v);
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
        <Button variant="contained" onClick={() => void handleSubmit()}>
          作成する
        </Button>
        <DisplayShareURLModal isOpen={showModal} shareURL={shareURL} />
      </Stack>
    </>
  );
};

const initStartTimeList = (
  startDay: Dayjs,
  endDay: Dayjs,
  startTime: IHourOfDay,
  endTime: IHourOfDay,
  eventTimeDuration: IEventTimeDuration,
): Record<string, boolean> => {
  // 与えられた情報から候補日の開始時間を決定し、checkListを初期化
  // console.log(
  //   startDay,
  //   endDay,
  //   // timePaddingではなく
  //   eventTimeDuration,
  //   eventTimeDuration,
  //   startTime,
  //   endTime,
  // );
  const startTimeList: string[] = createProposedStartTimeList(
    startDay,
    endDay,
    // timePaddingではなく
    eventTimeDuration,
    eventTimeDuration,
    startTime,
    endTime,
  );
  const initCheckList: Record<string, boolean> = {};
  startTimeList.forEach((v) => {
    initCheckList[v] = true;
  });
  return initCheckList;
};

export default Preview;
