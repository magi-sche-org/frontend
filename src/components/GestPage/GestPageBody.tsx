import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import eventData from "./eventData.json";
import { Button } from "../Button";

import { useRouter } from "next/router";
import { eventClient } from "@/service/api-client/client";
import {
  Answer,
  GetEventResponse,
  RegisterAnswerRequest,
} from "@/service/api-client/protocol/event_pb";
import { useSnackbar } from "notistack";
import { UserCalender } from "./UserCalender";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

type GuestPageBodyProps = {
  eventDetail: GetEventResponse.AsObject;
};
const GuestPageBody: FC<GuestPageBodyProps> = ({ eventDetail }) => {
  const router = useRouter();
  const [eventSchedule, _] = useState(createProposedScheduleList(eventDetail));
  const [NameText, setNameText] = useState<string>("");
  const [LoginFlg, setLoginFlg] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<boolean[]>(
    [...Array(eventSchedule.length)].map(() => true)
  );
  const { enqueueSnackbar } = useSnackbar();

  const Submit = async () => {
    const request = new RegisterAnswerRequest();
    request.setId(eventDetail.id);
    // TODO: トークン入れる
    request.setToken("hogehoge");
    // TODO: 答え登録
    const answer = new Answer();
    answer.setName("名前");
    const proposedScheduleList = eventSchedule.map((event) => {
      const proposedSchedule = new Answer.ProposedSchedule();
      const startTime = new Timestamp();
      startTime.fromDate(event.startTime);
      proposedSchedule.setStarttime(startTime);
      proposedSchedule.setAvailability(
        checklist[event.key]
          ? Answer.ProposedSchedule.Availability.AVAILABLE
          : Answer.ProposedSchedule.Availability.UNAVAILABLE
      );
      return proposedSchedule;
    });
    answer.setScheduleList(proposedScheduleList);
    request.setAnswer(answer);
    eventClient
      .registerAnswer(request, null)
      .then((res) => console.log(res))
      .then(() => {
        enqueueSnackbar("回答を記録しました。", {
          autoHideDuration: 2000,
          variant: "success",
        });
        router.push("/");
      });
  };

  return (
    <>
      <UserCalender />
      {/* タイトル・名前入力 */}
      <Stack direction="column" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          {eventData.EventTitle}
        </Typography>
        <TextField
          label="表示名"
          variant="outlined"
          sx={{ mx: 7, mb: 3 }}
          value={NameText}
          onChange={(e) => {
            setNameText(e.target.value);
          }}
        />
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
                  <Typography variant="caption">参加</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventData.ScheduleList.map((ScheduleInfo) => {
                return (
                  <TableRow key={ScheduleInfo.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {ScheduleInfo.day}
                        {ScheduleInfo.startTime}〜{ScheduleInfo.endTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        onChange={(e) => {
                          const newChecklist = [...checklist];
                          newChecklist[event.key] = e.target.checked;
                          setChecklist(newChecklist);
                        }}
                        checked={checklist[event.key]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* 未ログイン */}
        <Box sx={{ m: 3 }}>
          {!LoginFlg ? (
            <Typography variant="caption" sx={{ textAlign: "center" }}>
              ※未ログインの為、後から予定を編集することができませんがよろしいでしょうか？
            </Typography>
          ) : (
            <></>
          )}
        </Box>
        {/* 決定 */}
        <Stack direction="row" justifyContent="center" sx={{ mx: 15 }}>
          <Button text="決定" isPrimary={true} onClick={Submit} />
        </Stack>
      </Stack>
    </>
  );
};

export default GuestPageBody;
