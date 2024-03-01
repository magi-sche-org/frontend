import HighlightOffIcon from "@mui/icons-material/HighlightOff";
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
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { TSelectionRange } from "@/@types/selection";
import { PageTitle } from "@/components/common/PageTitle";
import { InputSchedule } from "@/components/EventMakePage/InputSchedule";
import { DisplayShareURLModal } from "@/components/preview/share-url";
import { createEvent } from "@/libraries/api/events";
import { setEventStorage } from "@/libraries/eventStorage";

type Props = {
  ranges: TSelectionRange[];
  duration: number;
};

const Preview: FC<Props> = ({ ranges, duration }) => {
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
    const startTimes = ranges
      .map((range) => {
        let startTimestamp = range.pos1.unix();
        const endTimestamp = range.pos2.unix();
        if (duration === 86400) {
          return [range.pos1.set("hour", 0).set("minute", 0).toISOString()];
        }
        if (endTimestamp - startTimestamp < duration) {
          return [];
        }
        const result: string[] = [];
        while (startTimestamp < endTimestamp) {
          result.push(dayjs.unix(startTimestamp).toISOString());
          startTimestamp += duration;
        }
        return result;
      })
      .flat(1);
    setStartTimeList(
      startTimes
        .map<[string, boolean]>((v) => [v, true])
        .reduce<Record<string, boolean>>(
          (acc, [k, v]) => ({ ...acc, [k]: v }),
          {},
        ),
    );
  }, [ranges]);

  const handleSubmit = async (): Promise<void> => {
    // checkedのものだけ抽出
    const filteringStartTimeList = Object.entries(startTimeList)
      .filter(([, checked]) => checked)
      .map(([startTime]) => startTime);
    const response = await createEvent(
      eventName,
      eventDescription,
      duration,
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
    <Container maxWidth="md">
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
          eventTimeDuration={duration}
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
                  if (Number(v) < 1) {
                    setParticipantsNumber("1");
                    return;
                  }
                  setParticipantsNumber(v);
                }}
                sx={{ width: "10em", ml: 0, mb: 2 }}
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
    </Container>
  );
};

export { Preview };
