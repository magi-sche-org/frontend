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
  TextField,
  Typography,
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
import { useSnackbar } from "notistack";
import { setEventStorage } from "@/libraries/eventStorage";
import { createProposedStartTimeList } from "@/libraries/proposedStartTime";
import { createEvent } from "@/libraries/api/events";
import { PageTitle } from "../common/PageTitle";
import { TimeSelect } from "./TimeSelect";

type EventTimeLengthType = {
  value: number;
  label: string;
};

const EventMakePageBody: React.FC = () => {
  const router = useRouter();

  // // イベント名
  // const [EventNameText, setEventNameText] = useState<string>("");
  // const [EventDescriptionText, setEventDescriptionText] = useState<string>("");
  // 時間
  const [StartTime, setStartTime] = useState<number>(10);
  const [EndTime, setEndTime] = useState<number>(17);
  // イベント時間の長さ
  const [EventTimeDuration, setEventTimeDuration] = useState<number>(1800);
  // 1コマあたりの時間
  const [TimePadding, setTimePadding] = useState<number>(1800);
  // 日付
  const [StartDay, setStartDay] = useState<Dayjs | undefined>(dayjs());
  const [EndDay, setEndDay] = useState<Dayjs | undefined>(dayjs().add(2, "h"));
  // モーダル
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [shareURL, setShareURL] = useState("");
  const handleStartDay = (newValue: Dayjs | null) => {
    setStartDay(newValue || undefined);
    if (newValue != null && EndDay != null) {
      // 開始日より終了日が小さければ開始日で終了日を更新
      if (newValue > EndDay) {
        setEndDay(newValue);
      }
    }
  };

  const handleEndDay = (newValue: Dayjs | null) => {
    setEndDay(newValue || undefined);
    if (newValue != null && StartDay != null) {
      // 終了より開始日が小さければ開始日で終了日を更新
      if (newValue < StartDay) {
        setStartDay(newValue);
      }
    }
  };

  const Submit = () => {
    // if (!EventNameText) {
    //   enqueueSnackbar("イベント名を入力してください", {
    //     autoHideDuration: 2000,
    //     variant: "error",
    //   });
    //   return;
    // }
    (async () => {
      try {
        const startTimeList: string[] = createProposedStartTimeList(
          StartDay,
          EndDay,
          TimePadding,
          EventTimeDuration,
          StartTime,
          EndTime,
        );

        const response = await createEvent(
          // EventNameText,
          // EventDescriptionText,
          EventTimeDuration,
          startTimeList,
        );

        setEventStorage(response);
        setShareURL(`https://${location.hostname}/guest/${response.id}`);
        setModalOpen(true);
      } catch (_) {
        enqueueSnackbar("イベントの作成に失敗しました", {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    })();
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
      value: 7200,
      label: "2時間",
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
              <TimeSelect time={StartTime} setTime={setStartTime} />
              <Typography variant="h6">〜</Typography>
              <TimeSelect
                time={EndTime}
                setTime={setEndTime}
                underTime={StartTime}
              />
            </Stack>
          </Stack>
          {/* イベントの長さ */}
          <FormControl>
            <FormLabel>イベントの長さ</FormLabel>
            <RadioGroup row>
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
            <Stack>
              <Typography variant="body1">開始日</Typography>
              <MobileDatePicker
                format="YYYY/MM/DD"
                value={StartDay}
                onChange={handleStartDay}
              />
            </Stack>
            <Stack>
              <Typography variant="body1">終了日</Typography>
              <MobileDatePicker
                format="YYYY/MM/DD"
                value={EndDay}
                onChange={handleEndDay}
              />
            </Stack>
          </LocalizationProvider>
        </Stack>
        <Divider />
        <Stack direction="row">
          <Button text="決定" isPrimary={true} onClick={Submit} />
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
              {" "}
              <Button
                text="トップに戻る"
                isPrimary={true}
                onClick={() => {
                  router.push("/");
                }}
              />{" "}
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
