import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
  RegisterAnswerRequest,
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
  const { enqueueSnackbar } = useSnackbar();
  const init = useRef(false);

  // TODO: この関数クッソ遅い。もっと早く出来るんだけど時間ないから
  const calcAttendance = (key: number) => {
    return eventDetail.answersList.filter((answer) => {
      // ひとりひとりのscheduleListに対して、keyに対応する時間の答えを持ってくる。
      // それがもしAVAILABLEであれば、1, そうでなければ0にする
      return (
        answer.scheduleList.find((schedule) => {
          // keyに対応する物のdateのTimestampを取得
          const timestamp = new Timestamp();
          timestamp.fromDate(eventSchedule[key].startTime);
          schedule.starttime?.seconds === timestamp.getSeconds();
        })?.availability === Answer.ProposedSchedule.Availability.AVAILABLE
      );
    }).length;
  };
  return (
    <>
      {/* タイトル表示*/}
      <Stack direction="column" sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          {eventData.EventTitle}
        </Typography>
        {/* 候補リスト */}
        <TableContainer
          sx={{
            border: "solid",
            borderWidth: 0.3,
            borderRadius: 5,
            p: 1,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption">日時</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">参加可能人数</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventSchedule.map((event) => {
                return (
                  <TableRow key={event.key}>
                    <TableCell>
                      <Typography variant="body1">
                        {event.startTime.getMonth() + 1}&thinsp;/&thinsp;
                        {event.startTime.getDay()}
                        &emsp;
                        {event.startTime.getHours()}:
                        {event.startTime.getMinutes()}〜
                        {event.endTime.getHours()}:{event.endTime.getMinutes()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {/* 参加できる人数を入れる */}
                        {calcAttendance(event.key)}
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
