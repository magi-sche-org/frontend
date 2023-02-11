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
import React from "react";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import eventData from "./eventData.json";
import { Button } from "../Button";

import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { UserCalender } from "./UserCalender";
import { createProposedScheduleList } from "./proposedSchedule";
import {
  GetEventResponse,
  RegisterAnswerRequest,
} from "../../service/api-client/protocol/event_pb";
import { eventClient } from "../../service/api-client/client";
type GuestPageBodyProps = {
  eventDetail: GetEventResponse.AsObject;
};
const GuestPageBody: FC<GuestPageBodyProps> = ({ eventDetail }) => {
  const router = useRouter();
  const [eventSchedule, _] = useState(createProposedScheduleList(eventDetail));
  const [NameText, setNameText] = useState<string>("");
  const [LoginFlg, setLoginFlg] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const Submit = async () => {
    const request = new RegisterAnswerRequest();
    request.setEventid(eventDetail.id);
    // TODO: トークン入れる
    request.setToken("hogehoge");
    // TODO: 答え登録
    request.setAnswer();
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
              {eventSchedule.map((event) => {
                return (
                  <TableRow key={event.key}>
                    <TableCell>
                      <Typography variant="body1">
                        {event.startTime.getMonth() + 1} /{" "}
                        {event.startTime.getDay()} {event.startTime.getHours()}:
                        {event.startTime.getMinutes()}〜
                        {event.endTime.getHours()}:{event.endTime.getMinutes()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox defaultChecked />
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
