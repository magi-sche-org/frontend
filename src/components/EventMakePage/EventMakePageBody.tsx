import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { IEventTimeDuration } from "@/@types/api/event";
import { CalendarWrapper } from "@/components/calendar/timeline-wrapper";

import { Button } from "../Button";
import { PageTitle } from "../common/PageTitle";
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
  const [startDay] = useState<Dayjs | undefined>(dayjs());
  const [endDay] = useState<Dayjs | undefined>(dayjs().add(3, "day"));

  const handleStartTime = (time: number): void => {
    localStorage.setItem("magiScheStartTime", String(time));
    setStartTime(time);
  };

  const handleEndTime = (time: number): void => {
    localStorage.setItem("magiScheEndTime", String(time));
    setEndTime(time);
  };

  const submit = (): void => {
    const startDayStr = startDay?.format("YYYY-MM-DD");
    const endDayStr = endDay ? endDay.format("YYYY-MM-DD") : startDayStr;
    // TODO:
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
        </Stack>
        {/* 日付ピッカー */}
        {/*<Stack spacing={3}>*/}
        {/*  <Divider />*/}
        {/*  <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
        {/*    <DateRangePicker*/}
        {/*      startDay={startDay}*/}
        {/*      endDay={endDay}*/}
        {/*      setStartDay={handleStartDay}*/}
        {/*      setEndDay={handleEndDay}*/}
        {/*    />*/}
        {/*  </LocalizationProvider>*/}
        {/*</Stack>*/}
        <div
          style={{
            width: "100%",
            height: "500px",
          }}
        >
          <CalendarWrapper
            count={7}
            startDate={dayjs()}
            dispatchOnChange={(...e) => console.log(e)}
          />
        </div>
        <Divider />
        <Stack direction="row">
          <Button text="決定" isPrimary={true} onClick={submit} />
        </Stack>
      </Stack>
    </>
  );
};

export { EventMakePageBody };
