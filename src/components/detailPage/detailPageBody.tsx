import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Stack } from "@mui/system";
import eventData from "../GestPage/eventData.json";

import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import {
  Answer,
  GetEventResponse,
} from "@/service/api-client/protocol/event_pb";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { createProposedScheduleList } from "../GestPage/proposedSchedule";
type GuestPageBodyProps = {
  eventDetail: GetEventResponse;
};

const DetailPageBody = ({ eventDetail }:GuestPageBodyProps) => {
  
  const list: {[key:string]: { available:number,unavailable: number }} = {};
  
  for (const answer of eventDetail.getAnswersList()){
    for (const schedule of answer.getScheduleList()){
      const key = schedule.getStarttime()?.getSeconds()||0;
      if (!list[key]){
        list[key] = {available: 0, unavailable:0};
      }
      if (schedule.getAvailability() === Answer.ProposedSchedule.Availability.AVAILABLE){
        list[key].available ++;
      }else{
        list[key].unavailable ++;
      }
    }
  }
  console.log(list)
  
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
              {/*[].map((event) => {
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
                        {/* 参加できる人数を入れる }
                        {calcAttendance(event.key)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })*/}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};

export {DetailPageBody};
