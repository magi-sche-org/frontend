import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

import type { IEventTimeDuration } from "@/@types/api/event";
import type { UserCalendarProvider } from "@/@types/calender";
import type {
  TDateSchedule,
  TSchedule,
  TTimeSchedule,
} from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";
import { CalendarRangePicker } from "@/components/calendar";
import { useCalendars } from "@/hooks/calendars";
import { DateManager } from "@/libraries/date-manager";

import { Button, Button as CButton } from "../Button";

const ModalStyle = {
  position: "absolute" as const,
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

type EventTimeLengthType = {
  value: IEventTimeDuration;
  label: string;
};

type Props = {
  onSubmit: (range: Record<string, boolean>, duration: number) => void;
  className?: string;
};

const EventMakePageBody: FC<Props> = ({ onSubmit, className }) => {
  const { calendars } = useCalendars();
  const schedules = useMemo(() => transformSchedule(calendars), [calendars]);
  const dateManager = useRef<DateManager>(new DateManager());
  const [selectedRanges, setSelectedRanges] = useState<TSelectionRange[]>([]);
  const [emptyRangesError, setEmptyRangesError] = useState<boolean>(false);

  // イベント時間の長さ
  const [eventTimeDuration, setEventTimeDuration] = useState<number>(1800);
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
    <Container maxWidth="md" className={className}>
      <Stack sx={{ p: 3 }} spacing={5}>
        <Stack spacing={6}>
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
          <CalendarRangePicker
            schedules={schedules}
            selectedRanges={selectedRanges}
            dispatchOnChange={(range, isAdd) => {
              if (isAdd) {
                dateManager.current.addRange(range);
              } else {
                dateManager.current.removeRange(range);
              }
              setSelectedRanges(dateManager.current.range);
            }}
          />
        </div>
        <Divider />
        <Stack direction="row">
          <Button
            text="決定"
            isPrimary={true}
            onClick={() => {
              if (selectedRanges.length === 0) {
                setEmptyRangesError(true);
                return;
              }
              onSubmit(
                transformRange(selectedRanges, eventTimeDuration),
                eventTimeDuration,
              );
            }}
          />
        </Stack>
      </Stack>

      <Modal open={emptyRangesError}>
        <Container maxWidth="xs" sx={{ ...ModalStyle }}>
          <Stack direction="column" sx={{ mx: 8 }}>
            <Typography
              variant="h6"
              noWrap={true}
              sx={{ textAlign: "center", mb: 4 }}
            >
              範囲を選択してください
            </Typography>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <CButton
                text="OK"
                isPrimary={false}
                onClick={() => {
                  setEmptyRangesError(false);
                }}
              />
            </Stack>
          </Stack>
        </Container>
      </Modal>
    </Container>
  );
};

export { EventMakePageBody };

const transformSchedule = (
  calendars: UserCalendarProvider[] | undefined,
): TSchedule[] => {
  return (
    calendars
      ?.map((calendar) =>
        calendar.events.map<TSchedule>((event) => {
          if (event.isAllDay) {
            return {
              id: event.id,
              startDate: dayjs(event.start),
              endDate: dayjs(event.end),
              name: event.name,
              url: event.url,
              displayOnly: false,
              isAllDay: true,
              color: "red",
              startTime: null,
              endTime: null,
            } as TDateSchedule;
          }
          return {
            id: event.id,
            startTime: dayjs(event.start),
            endTime: dayjs(event.end),
            name: event.name,
            url: event.url,
            displayOnly: false,
            isAllDay: false,
            color: "red",
            startDate: null,
            endDate: null,
          } as TTimeSchedule;
        }),
      )
      .flat(1) ?? []
  );
};

const transformRange = (
  ranges: TSelectionRange[],
  duration: number,
): Record<string, boolean> => {
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

  return startTimes
    .map<[string, boolean]>((v) => [v, true])
    .reduce<Record<string, boolean>>((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};
