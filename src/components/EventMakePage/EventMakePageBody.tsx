import {
  Box,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Slider,
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

const EventMakePageBody: React.FC = () => {
  const router = useRouter();

  // イベント名
  const [EventNameText, setEventNameText] = useState<string>("");
  // 時間
  const [TimeRange, setTimeRange] = useState<number[]>([10, 17]);
  // 1コマあたりの時間
  const [TimePadding, setTimePadding] = useState<string>("30min");
  // 日付
  const [StartDay, setStartDay] = useState<Dayjs | null>(dayjs());
  const [EndDay, setEndDay] = useState<Dayjs | null>(dayjs().add(2, "h"));
  // モーダル
  const [ModalOpen, setModalOpen] = useState<boolean>(false);

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
    setModalOpen(true);
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
        <Typography variant='body1' sx={{ textAlign: "center", mb: 2 }}>
          時間帯
        </Typography>
        <Stack direction='row'>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={TimeRange}
            onChange={(e, newAlignment: number | number[]) => {
              setTimeRange(newAlignment as number[]);
            }}
            valueLabelDisplay='auto'
            max={24}
            min={0}
            sx={{ mx: 5 }}
          />
        </Stack>
        <Stack direction='row' justifyContent='center' sx={{ mx: 3, mb: 3 }}>
          <Typography variant='body1'>{TimeRange[0]}時</Typography>
          <Typography variant='h6' sx={{ mx: 3 }}>
            〜
          </Typography>
          <Typography variant='body1'>{TimeRange[1]}時</Typography>
        </Stack>
        {/* 単位時間の設定 */}
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
        <Typography variant='caption' sx={{ textAlign: "center", mb: 2 }}>
          イベントの1コマあたりの時間を設定できます
        </Typography>
        {/* 日付ピッカー */}
        <Stack
          direction='column'
          sx={{ border: 1, borderWidth: 0.5, borderRadius: 3, p: 4, mx: 2, mb: 5 }}
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
                  <IconButton>
                    <ContentCopyOutlinedIcon />
                  </IconButton>
                )
              }}
              sx={{ mb: 4 }}
              value={"www.figma/file"}
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
