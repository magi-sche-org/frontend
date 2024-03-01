import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { IEventTimeDuration } from "@/@types/api/event";

import { Button } from "../Button";
import { PageTitle } from "../common/PageTitle";
import { DateRangePicker } from "./DateRangePicker/DateRangePicker";
import { TimeSelect } from "./TimeSelect";

type EventTimeLengthType = {
  value: IEventTimeDuration;
  label: string;
};

const EventMakePageBody: FC = () => {
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

  const handleStartTime = (time: number): void => {
    localStorage.setItem("magiScheStartTime", String(time));
    setStartTime(time);
  };

  const handleEndTime = (time: number): void => {
    localStorage.setItem("magiScheEndTime", String(time));
    setEndTime(time);
  };

  const handleStartDay = (newValue: Dayjs | undefined): void => {
    setStartDay(newValue ?? undefined);
    if (newValue != undefined && endDay != undefined) {
      // 開始日より終了日が小さければ開始日で終了日を更新
      if (newValue > endDay) {
        setEndDay(newValue);
      }
    }
  };

  const handleEndDay = (newValue: Dayjs | undefined): void => {
    setEndDay(newValue ?? undefined);
    if (newValue != undefined && startDay != undefined) {
      // 終了より開始日が小さければ開始日で終了日を更新
      if (newValue < startDay) {
        setStartDay(newValue);
      }
    }
  };

  const submit = (): void => {
    const startDayStr = startDay?.format("YYYY-MM-DD");
    const endDayStr = endDay ? endDay.format("YYYY-MM-DD") : startDayStr;
    void router.push(
      `/preview?startday=${startDayStr}&endday=${endDayStr}&starttime=${startTime}&endtime=${endTime}&eventtimeduration=${eventTimeDuration}`,
    );
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
    <Container maxWidth="md">
      <Stack sx={{ p: 3 }} spacing={5}>
        <PageTitle>イベント作成</PageTitle>
        <Stack spacing={6}>
          {/* 時間帯設定 */}
          <Stack spacing={0.5}>
            <FormLabel>時間帯</FormLabel>
            <Stack direction="row" spacing={4}>
              <TimeSelect
                time={startTime}
                handleTime={handleStartTime}
                upperTime={Math.min(24, endTime)}
              />
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
    </Container>
  );
};

export { EventMakePageBody };
