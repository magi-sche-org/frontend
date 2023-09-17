import { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { typeGuard } from "@/libraries/typeGuard";
import dayjs from "dayjs";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { Button as CButton } from "../components/Button";
import { IEventTimeDuration, IHourOfDay } from "@/@types/api/event";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useSchedule } from "@/hooks/useSchedule";
import { UserCalender } from "@/components/GuestPage/UserCalender";
import { Stack } from "@mui/system";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { createEvent } from "@/libraries/api/events";
import { createProposedStartTimeList } from "@/libraries/proposedStartTime";
import { InputSchedule } from "@/components/EventMakePage/InputSchedule";
import { setEventStorage } from "@/libraries/eventStorage";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export type IAnswerList = {
  // key: Dayjsをstring化したもの
  [unitStartTime: string]: boolean;
};

//http://localhost:3000/preview?startday=2023-09-01&endday=2023-09-03&starttime=11&endtime=13&eventtimeduration=1800
export default function Home() {
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
  const { schedules } = useSchedule();
  // モーダル
  const [showModal, setShowModal] = useState<boolean>(false);
  // 共有用URL
  const [shareURL, setShareURL] = useState("");
  // イベント名
  const [eventName, setEventName] = useState("");
  // 確定通知
  const [isConfirmNotice, setIsConfirmNotice] = useState(false);
  // 参加人数
  const [participantsCount, setParticipantsCount] = useState<string>("");
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

  const handleSubmit = async () => {
    // checkedのものだけ抽出
    const filteringStartTimeList = Object.entries(startTimeList)
      .filter(([_, checked]) => checked)
      .map(([startTime, _]) => startTime);
    console.log("submit: ", filteringStartTimeList);
    const response = await createEvent(
      eventName,
      "",
      eventTimeDuration,
      filteringStartTimeList,
    );

    setEventStorage(response);
    setShareURL(`https://${location.hostname}/guest/${response.id}`);
    setShowModal(true);
  };
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
        <InputSchedule
          eventTimeDuration={eventTimeDuration}
          checkList={startTimeList}
          setCheckList={(newCheckList) => setStartTimeList(newCheckList)}
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
                placeholder="3"
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*|",
                }}
                endAdornment={
                  <InputAdornment position="end">人</InputAdornment>
                }
                value={participantsCount}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v || isNaN(Number(v))) {
                    setParticipantsCount("");
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
        <Button variant="contained" onClick={handleSubmit}>
          作成する
        </Button>
        <DisplayShareURLModal isOpen={showModal} shareURL={shareURL} />
      </Stack>
    </>
  );
}

const initStartTimeList = (
  startDay: Dayjs,
  endDay: Dayjs,
  startTime: IHourOfDay,
  endTime: IHourOfDay,
  eventTimeDuration: IEventTimeDuration,
) => {
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

const ModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  border: "0.5px solid",
  borderRadius: 5,
  boxShadow: 10,
  p: 1,
  py: 5,
};

type DisplayShareURLModalProps = { isOpen: boolean; shareURL: string };
const DisplayShareURLModal: FC<DisplayShareURLModalProps> = ({
  isOpen,
  shareURL,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        enqueueSnackbar("URLをコピーしました", {
          autoHideDuration: 2000,
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("URLのコピーに失敗しました", {
          autoHideDuration: 2000,
          variant: "error",
        });
      });
  };
  return (
    <Modal open={isOpen}>
      <Container maxWidth="xs" sx={{ ...ModalStyle }}>
        <Stack direction="column" sx={{ mx: 8 }}>
          <Typography
            variant="h6"
            noWrap={true}
            sx={{ textAlign: "center", mb: 4 }}
          >
            イベントを作成しました
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center", mb: 1.5 }}>
            共有URL
          </Typography>
          <TextField
            variant="standard"
            InputProps={{
              startAdornment: (
                <IconButton
                  onClick={() => {
                    copyTextToClipboard(shareURL);
                  }}
                >
                  <ContentCopyOutlinedIcon />
                </IconButton>
              ),
            }}
            sx={{ mb: 4 }}
            value={shareURL}
          />
          <Stack spacing={2} sx={{ mb: 2 }}>
            {" "}
            <CButton
              text="トップに戻る"
              isPrimary={true}
              onClick={() => {
                router.push("/");
              }}
            />{" "}
            <CButton
              text="イベントを確認"
              isPrimary={false}
              onClick={() => {
                router.push(shareURL.replace("guest", "detail"));
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Modal>
  );
};
