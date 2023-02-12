import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import eventData from "../GestPage/eventData.json";

import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import {
  Answer,
  GetEventResponse,
  RegisterAnswerRequest
} from "../../service/api-client/protocol/event_pb";
import { eventClient } from "../../service/api-client/client";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { setEventToLocalStorage } from "@/libraries/setEventToLocalStorage";
import { getToken } from "@/libraries/token";
import { createProposedScheduleList } from "../GestPage/proposedSchedule";
import { UserCalender } from "../GestPage/UserCalender";
import { Schedule } from "@/@types/event";
import { getSchedules } from "@/libraries/calendar";
import { typeGuard } from "@/libraries/typeGuard";
type GuestPageBodyProps = {
  eventDetail: GetEventResponse.AsObject;
};

const DetailPageBody: FC<GuestPageBodyProps> = ({ eventDetail }) => {
  const router = useRouter();
  const [eventSchedule, _] = useState(createProposedScheduleList(eventDetail));
  const [NameText, setNameText] = useState<string>("");
  const [LoginFlg, setLoginFlg] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<boolean[]>(
    [...Array(eventSchedule.length)].map(() => true)
  );
  const { enqueueSnackbar } = useSnackbar();

  const [schedules, setSchedules] = useState<{ [key: string]: Schedule[] } | undefined>(undefined);
  const init = useRef(false);

  useEffect(() => {
    if (typeof window !== "object" || init.current) return;
    init.current = true;
    (async () => {
      try {
        const data = (await getSchedules(new Date())).reduce((pv, val) => {
          const date = new Date(
            typeGuard.DateTimeSchedule(val) ? val.start.dateTime : val.start.date
          );
          const key = `${date.getMonth() + 1}/${date.getDate()}`;
          if (!pv[key]) {
            pv[key] = [];
          }
          pv[key].push(val);
          return pv;
        }, {} as { [key: string]: Schedule[] });
        setSchedules(data);
      } catch (e) {
        setSchedules(undefined);
      }
    })();
  }, [setSchedules]);

  // const Submit = async () => {
  //   const request = new RegisterAnswerRequest();
  //   request.setEventid(eventDetail.id);
  //   request.setToken(getToken(localStorage));
  //   const answer = new Answer();
  //   answer.setName(NameText);
  //   const proposedScheduleList = eventSchedule.map((event) => {
  //     const proposedSchedule = new Answer.ProposedSchedule();
  //     const startTime = new Timestamp();
  //     startTime.fromDate(event.startTime);
  //     proposedSchedule.setStarttime(startTime);
  //     proposedSchedule.setAvailability(
  //       checklist[event.key]
  //         ? Answer.ProposedSchedule.Availability.AVAILABLE
  //         : Answer.ProposedSchedule.Availability.UNAVAILABLE
  //     );
  //     return proposedSchedule;
  //   });
  //   answer.setScheduleList(proposedScheduleList);
  //   request.setAnswer(answer);
  //   eventClient
  //     .registerAnswer(request, null)
  //     .then((res) => console.log(res))
  //     .then(() => {
  //       enqueueSnackbar("回答を記録しました。", {
  //         autoHideDuration: 2000,
  //         variant: "success"
  //       });
  //       // イベント入れる
  //       setEventToLocalStorage(eventDetail.name, eventDetail.id, localStorage);
  //       router.push("/");
  //     });
  // };

  return (
    <>
      <UserCalender schedules={{}} />
      {/* タイトル表示*/}
      <Stack direction='column' sx={{ p: 3, mt: 2 }}>
        <Typography variant='h6' sx={{ textAlign: "center", mb: 3 }}>
          {eventData.EventTitle}
        </Typography>
        {/* 候補リスト */}
        <TableContainer
          sx={{
            border: "solid",
            borderWidth: 0.3,
            borderRadius: 5,
            p: 1
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant='caption'>日時</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='caption'>参加可能人数</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventSchedule.map((event) => {
                return (
                  <TableRow key={event.key}>
                    <TableCell>
                      <Typography variant='body1'>
                        {event.startTime.getMonth() + 1}&thinsp;/&thinsp;{event.startTime.getDay()}
                        &emsp;
                        {event.startTime.getHours()}:{event.startTime.getMinutes()}〜
                        {event.endTime.getHours()}:{event.endTime.getMinutes()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body1' sx={{ ml: 1 }}>
                        {/* 参加できる人数を入れる */}
                        {10}人
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};

export default DetailPageBody;
