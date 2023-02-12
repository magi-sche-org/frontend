import {
  Container,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "../Button";
import { ModalStyle } from "../ModalStyle";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useRouter } from "next/router";
import { eventClient } from "@/service/api-client/client";
import { CreateEventRequest } from "@/service/api-client/protocol/event_pb";
import { Duration } from "google-protobuf/google/protobuf/duration_pb";
import { useSnackbar } from "notistack";
import { setEventToLocalStorage } from "@/libraries/setEventToLocalStorage";

const EventMakePageBody: React.FC = () => {
  const router = useRouter();

  // イベント名
  const [EventNameText, setEventNameText] = useState<string>("");
  // 時間
  const [StartTime, setStartTime] = useState<number | string>(10);
  const [EndTime, setEndTime] = useState<number | string>(17);
  // イベント時間の長さ
  const [EventTimeRange, setEventTimeRange] = useState<string>("30min");
  // 1コマあたりの時間
  const [TimePadding, setTimePadding] = useState<string>("30min");
  // 日付
  const [StartDay, setStartDay] = useState<Dayjs | null>(dayjs());
  const [EndDay, setEndDay] = useState<Dayjs | null>(dayjs().add(2, "h"));
  // モーダル
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [shareURL, setShareURL] = useState("");
  const handleStartDay = (newValue: Dayjs | null) => {
    setStartDay(newValue);
    if (newValue != null && EndDay != null) {
      // 開始日より終了日が小さければ開始日で終了日を更新
      if (newValue > EndDay) {
        setEndDay(newValue);
      }
    }
  };

  const handleEndDay = (newValue: Dayjs | null) => {
    setEndDay(newValue);
    if (newValue != null && StartDay != null) {
      // 終了より開始日が小さければ開始日で終了日を更新
      if (newValue < StartDay) {
        setStartDay(newValue);
      }
    }
  };

  const Submit = () => {
    const request = new CreateEventRequest();
    request.setName(EventNameText);
    const duration = new Duration();

    switch (TimePadding) {
      case "30min":
        duration.setSeconds(30 * 60);
        break;
      case "1h":
        duration.setSeconds(60 * 60);
        break;
      case "1day":
        duration.setSeconds(24 * 60 * 60);
        break;
    }
    // TODO: token
    request.setToken("hoge");
    // TODO: 導線が無いと作れない
    request.setProposedstarttimeList([]);
    request.setTimeunit();

    eventClient
      .createEvent(request, null)
      .then((res) => {
        console.log(res);
        const id = res.getEventid();
        // TODO: 環境変数
        // イベント入れる
        setEventToLocalStorage(EventNameText, id, localStorage);
        setShareURL(`localhost:3000/guest/${id}`);
        setModalOpen(true);
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar("イベントの作成に失敗しました", {
          autoHideDuration: 2000,
          variant: "error"
        });
      });
  };

  const timeList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
  ];

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        enqueueSnackbar("URLをコピーしました", {
          autoHideDuration: 2000,
          variant: "success"
        });
      })
      .catch(() => {
        enqueueSnackbar("URLのコピーに失敗しました", {
          autoHideDuration: 2000,
          variant: "error"
        });
      });
  };
  return (
    <>
      <Stack sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ textAlign: "center", my: 3 }}>
          イベント作成
        </Typography>
        {/* イベント名 */}
        <TextField
          variant='outlined'
          label='イベント名'
          sx={{ mx: 3, mb: 5 }}
          value={EventNameText}
          onChange={(e) => {
            setEventNameText(e.target.value);
          }}
        />
        {/* 時間帯設定 */}
        <Typography variant='body1' sx={{ textAlign: "center", mb: 1 }}>
          時間帯
        </Typography>
        <Stack direction='row' justifyContent='center' sx={{ mx: 3, mb: 4 }}>
          <FormControl variant='standard' sx={{ m: 2, minWidth: 80 }}>
            <Select
              value={StartTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            >
              {timeList.map((timeInfo) => {
                return (
                  <MenuItem key={timeInfo} value={timeInfo}>
                    {timeInfo}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography variant='h6' sx={{ mt: 2, mx: 3 }}>
            〜
          </Typography>
          <FormControl variant='standard' sx={{ m: 2, minWidth: 80 }}>
            <Select
              value={EndTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            >
              {timeList.map((timeInfo) => {
                return (
                  <MenuItem key={timeInfo} value={timeInfo}>
                    {timeInfo}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        {/* イベントの長さ */}
        <Stack direction='column' sx={{ mx: 5, mb: 5 }}>
          <Typography variant='body1' sx={{ textAlign: "center", mb: 2 }}>
            イベントの長さ
          </Typography>
          <FormControl>
            <InputLabel htmlFor='grouped-select'>イベントの時間</InputLabel>
            <Select
              defaultValue='30min'
              label='イベント時間'
              value={EventTimeRange}
              onChange={(e) => {
                setEventTimeRange(e.target.value);
              }}
            >
              <ListSubheader>MIN</ListSubheader>
              <MenuItem value={"15min"}>15min</MenuItem>
              <MenuItem value={"30min"}>30min</MenuItem>
              <ListSubheader>Hour</ListSubheader>
              <MenuItem value={"1h"}>1h</MenuItem>
              <MenuItem value={"2h"}>2h</MenuItem>
              <MenuItem value={"3h"}>3h</MenuItem>
              <MenuItem value={"4h"}>4h</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {/* 単位時間の設定 */}
        <Typography variant='body1' sx={{ textAlign: "center", mb: 2 }}>
          イベント枠を作る時間
        </Typography>
        <Stack direction='row' justifyContent='center' sx={{ mb: 2 }}>
          <ToggleButtonGroup
            color='primary'
            value={TimePadding}
            exclusive
            onChange={(e, newAlignment: string) => {
              setTimePadding(newAlignment);
            }}
            aria-label='Platform'
          >
            <ToggleButton value='30min'>30min</ToggleButton>
            <ToggleButton value='1h'>　1h　</ToggleButton>
            <ToggleButton value='1day'>1day</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Typography variant='caption' sx={{ textAlign: "center", mb: 3 }}>
          - イベント枠を生成する単位時間を設定できます
        </Typography>
        {/* 日付ピッカー */}
        <Stack
          direction='column'
          sx={{
            border: 1,
            borderWidth: 0.5,
            borderRadius: 3,
            p: 4,
            mx: 2,
            mb: 5
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction='column' sx={{ mb: 2 }}>
              <Typography variant='body1'>開始日</Typography>
              <MobileDatePicker
                inputFormat='YYYY/MM/DD'
                value={StartDay}
                onChange={handleStartDay}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
            <Stack direction='column' sx={{ mb: 2 }}>
              <Typography variant='body1'>終了日</Typography>
              <MobileDatePicker
                inputFormat='YYYY/MM/DD'
                value={EndDay}
                onChange={handleEndDay}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Stack>
        <Stack direction='row' sx={{ mx: 15 }}>
          <Button text='決定' isPrimary={true} onClick={Submit} />
        </Stack>
      </Stack>

      <Modal open={ModalOpen}>
        <Container maxWidth='xs' sx={{ ...ModalStyle }}>
          <Stack direction='column' sx={{ mx: 8 }}>
            <Typography variant='h6' noWrap={true} sx={{ textAlign: "center", mb: 4 }}>
              イベントを作成しました
            </Typography>
            <Typography variant='body2' sx={{ textAlign: "center", mb: 1.5 }}>
              共有URL
            </Typography>
            <TextField
              variant='standard'
              InputProps={{
                startAdornment: (
                  <IconButton
                    onClick={() => {
                      copyTextToClipboard(shareURL);
                    }}
                  >
                    <ContentCopyOutlinedIcon />
                  </IconButton>
                )
              }}
              sx={{ mb: 4 }}
              value={shareURL}
            />
            <Stack spacing={2} sx={{ mb: 2 }}>
              {" "}
              <Button
                text='トップに戻る'
                isPrimary={true}
                onClick={() => {
                  router.push("/");
                }}
              />{" "}
              <Button
                text='イベントを確認'
                isPrimary={false}
                onClick={() => {
                  router.push("/");
                }}
              />
            </Stack>
          </Stack>
        </Container>
      </Modal>
    </>
  );
};

export default EventMakePageBody;
