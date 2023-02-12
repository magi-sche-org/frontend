import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {useEffect, useRef,useState} from "react";
import { Stack } from "@mui/system";
import { Button } from "../Button";

import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { UserCalender } from "./UserCalender";
import {
  Answer,
  GetEventResponse,
  RegisterAnswerRequest,
} from "@/service/api-client/protocol/event_pb";
import { eventClient } from "@/service/api-client/client";
import {getEventStorage, setEventStorage} from "@/libraries/eventStorage";
import { getToken } from "@/libraries/token";
import {Schedule} from "@/@types/event";
import {getSchedules} from "@/libraries/calendar";
import {typeGuard} from "@/libraries/typeGuard";
import {date2time} from "@/libraries/time";
import Styles from "./GuestPageBody.module.scss";
type GuestPageBodyProps = {
  eventDetail: GetEventResponse;
};
const GuestPageBody = ({ eventDetail }:GuestPageBodyProps) => {
  const router = useRouter();
  const [NameText, setNameText] = useState<string>("");
  const [checklist, setChecklist] = useState<{ [key:string]: { val:boolean,block:boolean }}>({});
  const { enqueueSnackbar } = useSnackbar();
  const [schedules,setSchedules] = useState<{[key:string]:Schedule[]}|undefined|null>(undefined);
  const init = useRef(false);
  
  const isAnswered = getEventStorage().reduce((pv:boolean,val)=>val.answered||pv,false);
  
  useEffect(()=>{
    if (typeof window !== "object"||init.current)return;
    init.current = true;
    (async()=>{
      try{
        const raw = await getSchedules(new Date());
        const data = raw.reduce((pv,val)=>{
          const date = new Date(typeGuard.DateTimeSchedule(val)?val.start.dateTime:val.start.date);
          const key = `${date.getMonth()+1}/${date.getDate()}`
          if (!pv[key]){
            pv[key] = [];
          }
          pv[key].push(val);
          return pv
        },{} as {[key:string]:Schedule[]});
        setSchedules(data);
        const list = eventDetail.getProposedstarttimeList().reduce((pv,ts)=>{
          const start = ts.getSeconds();
          const end = ts.getSeconds() + (eventDetail.getDuration()?.getSeconds()||0);
          const block = raw.reduce((pv,val)=>{
            const [start_,end_] = (()=>{
              if (typeGuard.DateTimeSchedule(val)){
                return [Math.floor(new Date(val.start.dateTime).getTime()/1000),new Date(val.end.dateTime).getTime()/1000]
              }
              return [Math.floor(new Date(val.start.date).getTime()/1000),new Date(val.end.date).getTime()/1000]
            })();
            console.log(start,end,start_,end_);
            if (end_<start||start_ > end){
              return pv;
            }
            return true;
          },false);
          pv[`${start}`] = {val:!block,block};
          return pv;
        },{} as {[key:string]:{ val:boolean,block:boolean }});
        setChecklist(list);
      }catch (e) {
        setSchedules(null);
      }
    })();
  },[setSchedules]);
  if (schedules===undefined) {
    return <></>;
  }

  const Submit = async () => {
    const request = new RegisterAnswerRequest();
    request.setEventid(eventDetail.getId());
    request.setToken(getToken(localStorage));
    const answer = new Answer();
    answer.setName(NameText);
    const proposedScheduleList = eventDetail.getProposedstarttimeList().map((ts) => {
      const proposedSchedule = new Answer.ProposedSchedule();
      proposedSchedule.setStarttime(ts);
      proposedSchedule.setAvailability(
        (checklist[ts.getSeconds()]??true)
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
          variant: "success"
        });
        // イベント入れる
        setEventStorage(eventDetail.getName(), eventDetail.getId(),true);
        router.push("/");
      });
  };

  return (
    <>
      {isAnswered&&<h1>ずでに回答済みです</h1>}
      {schedules&&<UserCalender schedules={schedules}/>}
      {/* タイトル・名前入力 */}
      <Stack direction='column' sx={{ p: 3 }}>
        <Typography variant='h6' sx={{ textAlign: "center", mb: 3 }}>
          {eventDetail.getName()}
        </Typography>
        <TextField
          label='表示名'
          variant='outlined'
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
                  <Typography variant='caption'>参加</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventDetail.getProposedstarttimeList().map((ts) => {
                const start = new Date(ts.getSeconds()*1000);
                console.log(eventDetail)
                const end = new Date((ts.getSeconds() + (eventDetail.getDuration()?.getSeconds()||0)) * 1000)
                const key = ts.getSeconds();
                return (
                  <TableRow key={ts.getSeconds()}>
                    <TableCell>
                      <Typography variant="body1">
                        {start.getMonth() + 1}/{start.getDate()}{" "}
                        {date2time(start)}〜
                        {date2time(end)}
                      </Typography>
                    </TableCell>
                    <TableCell className={`${Styles.wrapper}`}>
                      <Checkbox
                        onChange={(e) => {
                          const value = checklist[key]
                          setChecklist({...checklist,[key]:{val:e.target.checked,block:value.block}});
                        }}
                        checked={checklist[ts.getSeconds()]?.val??true}
                      />
                      {checklist[key]?.val&&checklist[key]?.block&&<span className={Styles.info}>[i] 他の予定と重複しています</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* 未ログイン */}
        <Box sx={{ m: 3 }}>
        </Box>
        {/* 決定 */}
        <Stack direction='row' justifyContent='center' sx={{ mx: 15 }}>
          <Button text='決定' isPrimary={true} onClick={Submit} />
        </Stack>
      </Stack>
    </>
  );
};

export default GuestPageBody;
