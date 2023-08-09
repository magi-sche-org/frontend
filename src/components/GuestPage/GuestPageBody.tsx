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
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import { getEventStorage, setEventStorage } from "@/libraries/eventStorage";
import { getToken } from "@/libraries/token";
import { Schedule } from "@/@types/event";
import { getSchedules } from "@/libraries/calendar";
import { typeGuard } from "@/libraries/typeGuard";
import { date2time } from "@/libraries/time";
import Styles from "./GuestPageBody.module.scss";
import crypto from "crypto-js";

type GuestPageBodyProps = {
  eventDetail: GetEventResponse;
};

const hashToken = (hash: string): string => {
  return crypto.SHA256(hash).toString(crypto.enc.Base64);
};

const GuestPageBody = ({ eventDetail }: GuestPageBodyProps) => {
  const router = useRouter();
  const [NameText, setNameText] = useState<string>(() => {
    const answers = eventDetail.getAnswersList();
    for (const answer of answers) {
      if (answer.getNote() === hashToken(getToken(localStorage))) {
        return answer.getName();
      }
    }
    return "";
  });
  const [checklist, setChecklist] = useState<{
    [key: string]: { val: boolean; block: boolean };
  }>(() => {
    const answers = eventDetail.getAnswersList();
    for (const answer of answers) {
      if (answer.getNote() === hashToken(getToken(localStorage))) {
        const result: { [key: number]: { val: boolean; block: boolean } } = {};
        for (const schedule of answer.getScheduleList()) {
          result[
            Math.floor(
              (schedule.getStarttime()?.toDate().getTime() || 0) / 1000,
            )
          ] = {
            val:
              schedule.getAvailability() ===
              Answer.ProposedSchedule.Availability.AVAILABLE,
            block: false,
          };
        }
        return result;
      }
    }
    return {};
  });
  const { enqueueSnackbar } = useSnackbar();
  const [schedules, setSchedules] = useState<
    { [key: string]: Schedule[] } | undefined | null
  >(undefined);
  const init = useRef(false);
  const isAnswered = getEventStorage().reduce(
    (pv: boolean, val) =>
      (val.answered && val.id === eventDetail.getId()) || pv,
    false,
  );
  useEffect(() => {
    if (typeof window !== "object" || init.current) return;
    init.current = true;
    (async () => {
      try {
        const raw = await getSchedules(new Date());
        const data = raw.reduce(
          (pv, val) => {
            const date = new Date(
              typeGuard.DateTimeSchedule(val)
                ? val.start.dateTime
                : val.start.date,
            );
            const key = `${date.getMonth() + 1}/${date.getDate()}`;
            if (!pv[key]) {
              pv[key] = [];
            }
            pv[key].push(val);
            return pv;
          },
          {} as { [key: string]: Schedule[] },
        );
        setSchedules(data);
        const list = eventDetail.getProposedstarttimeList().reduce(
          (pv, ts) => {
            const start = ts.getSeconds();
            const end =
              ts.getSeconds() + (eventDetail.getDuration()?.getSeconds() || 0);
            const block = raw.reduce((pv, val) => {
              const [start_, end_] = (() => {
                if (typeGuard.DateTimeSchedule(val)) {
                  return [
                    Math.floor(new Date(val.start.dateTime).getTime() / 1000),
                    new Date(val.end.dateTime).getTime() / 1000,
                  ];
                }
                return [
                  Math.floor(new Date(val.start.date).getTime() / 1000),
                  new Date(val.end.date).getTime() / 1000,
                ];
              })();
              if (end_ < start || start_ > end) {
                return pv;
              }
              return true;
            }, false);
            pv[`${start}`] = {
              val: checklist[`${start}`]?.val ?? !block,
              block,
            };
            return pv;
          },
          {} as { [key: string]: { val: boolean; block: boolean } },
        );
        setChecklist(list);
      } catch (e) {
        setSchedules(null);
        const list = eventDetail.getProposedstarttimeList().reduce(
          (pv, ts) => {
            const start = ts.getSeconds();
            pv[`${start}`] = {
              val: checklist[`${start}`]?.val ?? true,
              block: false,
            };
            return pv;
          },
          {} as { [key: string]: { val: boolean; block: boolean } },
        );
        setChecklist(list);
      }
    })();
  }, [setSchedules]);
  if (schedules === undefined) {
    return <></>;
  }

  const Submit = async () => {
    // Submit validation
    if (!NameText) {
      enqueueSnackbar("表示名を入力してください", {
        autoHideDuration: 2000,
        variant: "error",
      });
      return;
    }
    const request = new RegisterAnswerRequest();
    request.setEventid(eventDetail.getId());
    request.setToken(getToken(localStorage));
    const answer = new Answer();
    answer.setName(NameText);
    const proposedScheduleList = eventDetail
      .getProposedstarttimeList()
      .map((ts) => {
        const proposedSchedule = new Answer.ProposedSchedule();
        proposedSchedule.setStarttime(ts);
        proposedSchedule.setAvailability(
          checklist[ts.getSeconds()].val ?? true
            ? Answer.ProposedSchedule.Availability.AVAILABLE
            : Answer.ProposedSchedule.Availability.UNAVAILABLE,
        );
        return proposedSchedule;
      });
    answer.setScheduleList(proposedScheduleList);
    answer.setNote(hashToken(getToken(localStorage)));
    request.setAnswer(answer);
    eventClient.registerAnswer(request, null).then(() => {
      enqueueSnackbar("回答を記録しました。", {
        autoHideDuration: 2000,
        variant: "success",
      });
      setEventStorage(eventDetail.getName(), eventDetail.getId(), true);
      router.push("/");
    });
  };

  return (
    <>
      {schedules && <UserCalender schedules={schedules} />}
      {/* タイトル・名前入力 */}
      <Stack direction="column" sx={{ p: 3 }}>
        <Stack sx={{ mx: 10, mb: 5, mt: 1 }}>
          {isAnswered && (
            <Button
              text={"閲覧ページへ"}
              isPrimary={true}
              onClick={() => {
                router.push(`/detail/${router.query.id}`);
              }}
            />
          )}
        </Stack>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          {eventDetail.getName()}
        </Typography>
        <TextField
          label="表示名"
          variant="outlined"
          sx={{ mx: 7, mb: 3 }}
          value={NameText}
          onChange={(e) => {
            setNameText(e.target.value);
          }}
          required
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
              {eventDetail.getProposedstarttimeList().map((ts) => {
                const start = new Date(ts.getSeconds() * 1000);
                const end = new Date(
                  (ts.getSeconds() +
                    (eventDetail.getDuration()?.getSeconds() || 0)) *
                    1000,
                );
                const key = ts.getSeconds();
                return (
                  <TableRow key={ts.getSeconds()}>
                    <TableCell>
                      <Typography variant="body1">
                        {start.getMonth() + 1}/{start.getDate()}{" "}
                        {date2time(start)}〜{date2time(end)}
                      </Typography>
                    </TableCell>
                    <TableCell className={`${Styles.wrapper}`}>
                      <Checkbox
                        onChange={(e) => {
                          const value = checklist[key];
                          setChecklist({
                            ...checklist,
                            [key]: {
                              val: e.target.checked,
                              block: value.block,
                            },
                          });
                        }}
                        checked={checklist[ts.getSeconds()]?.val ?? true}
                      />
                      {checklist[key]?.val && checklist[key]?.block && (
                        <span className={Styles.info}>
                          <Typography variant="caption">重複</Typography>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* 未ログイン */}
        <Box sx={{ m: 3 }} />
        {/* 決定 */}
        <Stack direction="row" justifyContent="center" sx={{ mx: 15 }}>
          <Button
            text={isAnswered ? "更新" : "決定"}
            isPrimary={true}
            onClick={Submit}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default GuestPageBody;
