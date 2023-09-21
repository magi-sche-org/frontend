import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "../Button";
import { ModalStyle } from "../ModalStyle";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { PageTitle } from "../common/PageTitle";
import { TimeSelect } from "./TimeSelect";
import { IEventTimeDuration } from "@/@types/api/event";
import { DateRangePicker } from "./DateRangePicker/DateRangePicker";

type EventTimeLengthType = {
  value: IEventTimeDuration;
  label: string;
};

const EventMakePageBody: React.FC = () => {
  const router = useRouter();

  // 時間
  const [startTime, setStartTime] = useState<number>(10);
  const [endTime, setEndTime] = useState<number>(17);
  // イベント時間の長さ
  const [eventTimeDuration, setEventTimeDuration] = useState<number>(1800);
  // 日付
  const [startDay, setStartDay] = useState<Dayjs | undefined>(dayjs());
  const [endDay, setEndDay] = useState<Dayjs | undefined>(
    dayjs().add(3, "day"),
  );
  // モーダル
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [shareURL, setShareURL] = useState("");

  const handleStartTime = (time: number) => {
    localStorage.setItem("magiScheStartTime", String(time));
    setStartTime(time);
  };

  const handleEndTime = (time: number) => {
    localStorage.setItem("magiScheEndTime", String(time));
    setEndTime(time);
  };

  const handleStartDay = (newValue: Dayjs | undefined) => {
    setStartDay(newValue || undefined);
    if (newValue != undefined && endDay != undefined) {
      // 開始日より終了日が小さければ開始日で終了日を更新
      if (newValue > endDay) {
        setEndDay(newValue);
      }
    }
  };

  const handleEndDay = (newValue: Dayjs | undefined) => {
    setEndDay(newValue || undefined);
    if (newValue != undefined && startDay != undefined) {
      // 終了より開始日が小さければ開始日で終了日を更新
      if (newValue < startDay) {
        setStartDay(newValue);
      }
    }
  };

  const submit = () => {
    const startDayStr = startDay?.format("YYYY-MM-DD");
    const endDayStr = endDay ? endDay.format("YYYY-MM-DD") : startDayStr;
    // TODO:
    router.push(
      `http://localhost:3000/preview?startday=${startDay}&endday=${endDayStr}&starttime=${startTime}&endtime=${endTime}&eventtimeduration=${eventTimeDuration}`,
    );
  };

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

  /**
   * 過去選択した時間があればそれを反映
   */
  useEffect(() => {
    const startTimeStr = localStorage.getItem("magiScheStartTime");
    const endTimeStr = localStorage.getItem("magiScheEndTime");
    if (startTimeStr) setStartTime(Number(startTimeStr));
    if (endTimeStr) setEndTime(Number(endTimeStr));
  }, []);

  const eventTimeLengthList: EventTimeLengthType[] = [
    {
      value: 1800,
      label: "30分",
    },
    {
      value: 3600,
      label: "1時間",
    },
    {
      value: 86400,
      label: "終日",
    },
  ];

  return (
    <>
      <Stack sx={{ p: 3 }} spacing={5}>
        <PageTitle>イベント作成</PageTitle>
        <Stack spacing={6}>
          {/* 時間帯設定 */}
          <Stack spacing={0.5}>
            <FormLabel>時間帯</FormLabel>
            <Stack direction="row" spacing={4}>
              <TimeSelect time={startTime} handleTime={handleStartTime} />
              <Typography variant="h6">〜</Typography>
              <TimeSelect
                time={endTime}
                handleTime={handleEndTime}
                underTime={startTime}
              />
            </Stack>
          </Stack>
          {/* イベントの長さ */}
          <FormControl>
            <FormLabel>イベントの長さ</FormLabel>
            <RadioGroup
              row
              value={eventTimeDuration}
              onChange={(e) => {
                setEventTimeDuration(Number(e.target.value));
              }}
            >
              {eventTimeLengthList.map((item) => {
                return (
                  <FormControlLabel
                    key={item.value}
                    control={<Radio />}
                    value={item.value}
                    label={item.label}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          {/* <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
              <ToggleButtonGroup
                color="primary"
                value={TimePadding}
                exclusive
                onChange={(e, newAlignment: string) => {
                  setTimePadding(Number(newAlignment));
                }}
                aria-label="Platform"
              >
                <ToggleButton value={1800}>30min</ToggleButton>
                <ToggleButton value={3600}>　1h　</ToggleButton>
                <ToggleButton value={86400}>1day</ToggleButton>
              </ToggleButtonGroup>
            </Stack> */}
        </Stack>
        {/* 日付ピッカー */}
        <Stack spacing={3}>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startDay={startDay}
              endDay={endDay}
              setStartDay={handleStartDay}
              setEndDay={handleEndDay}
            />
          </LocalizationProvider>
        </Stack>
        <Divider />
        <Stack direction="row">
          <Button text="決定" isPrimary={true} onClick={submit} />
        </Stack>
      </Stack>

      <Modal open={ModalOpen}>
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
              <Button
                text="トップに戻る"
                isPrimary={true}
                onClick={() => {
                  router.push("/");
                }}
              />
              <Button
                text="イベントを確認"
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
