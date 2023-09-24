import Brightness1Icon from "@mui/icons-material/Brightness1";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CloseIcon from "@mui/icons-material/Close";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
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
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";

import type { IAvailability, IEvent, IUserAnswer } from "@/@types/api/event";
import { useCalendars } from "@/hooks/calendars";
import { useUser } from "@/hooks/user";
import { createAnswer } from "@/libraries/api/events";
import { getEventStorage, setEventStorage } from "@/libraries/eventStorage";

import { Button } from "../Button";
import Styles from "./GuestPageBody.module.scss";
import { UserCalender } from "./UserCalender";

type props = {
  event: IEvent;
};

export type IAnswerList = {
  [key: string]: {
    val: IAvailability;
    block: boolean;
    startsAt: string;
    id: string;
  };
};

const GuestPageBody = ({ event }: props) => {
  const router = useRouter();
  const { user } = useUser();
  const { calendars } = useCalendars();
  const [NameText, setNameText] = useState<string>(getDefaultName(event));
  const [checklist, setChecklist] = useState<IAnswerList>(() => {
    const answer = getMyAnswer(event)?.units.map((answer) => {
      return {
        startsAt: event.units.find((unit) => unit.id === answer.eventTimeUnitId)
          ?.startsAt,
        ...answer,
      };
    });
    if (!answer) return {};
    const result: IAnswerList = {};
    for (const unit of answer) {
      if (!unit.startsAt) throw new Error("invalid answer");
      result[unit.eventTimeUnitId] = {
        id: unit.eventTimeUnitId,
        startsAt: unit.startsAt,
        val: unit.availability,
        block: false,
      };
    }
    return result;
  });
  const { enqueueSnackbar } = useSnackbar();
  const init = useRef(false);
  const isAnswered = getEventStorage().reduce(
    (pv: boolean, val) => (val.yourAnswerId && val.id === event.id) || pv,
    false,
  );

  useEffect(() => {
    if (typeof window !== "object" || init.current || !calendars) return;
    init.current = true;
    const list = event.units.reduce((pv, unit) => {
      const start = dayjs(unit.startsAt);
      const end = dayjs(unit.startsAt).add(event.unitDuration, "seconds");
      const block = calendars.reduce((pv, provider) => {
        if (pv) return true;
        return provider.events.reduce((pv, schedule) => {
          if (pv) return true;
          if (start.isAfter(schedule.end) || schedule.start.isAfter(end)) {
            return pv;
          }
          return true;
        }, false);
      }, false);
      const current = checklist[unit.id];
      pv[unit.id] = {
        id: unit.id,
        startsAt: unit.startsAt,
        val: current?.val ?? (block ? "unavailable" : "available"),
        block,
      };
      return pv;
    }, {} as IAnswerList);
    setChecklist(list);
  }, [calendars, event]);

  const Submit = async () => {
    // Submit validation
    if (!NameText) {
      enqueueSnackbar("表示名を入力してください", {
        autoHideDuration: 2000,
        variant: "error",
      });
      return;
    }
    await createAnswer(
      event.id,
      NameText,
      "",
      Object.values(checklist).map((val) => {
        return {
          eventTimeUnitId: val.id,
          availability: val.val,
        };
      }),
    );
    enqueueSnackbar("回答を記録しました。", {
      autoHideDuration: 2000,
      variant: "success",
    });
    setEventStorage(event);
    void router.push("/");
  };

  return (
    <>
      {user?.isRegistered && calendars && (
        <UserCalender calendars={calendars} />
      )}
      {/* タイトル・名前入力 */}
      <Stack direction="column" sx={{ p: 3 }}>
        <Stack sx={{ mx: 10, mb: 5, mt: 1 }}>
          {isAnswered && (
            <Button
              text={"閲覧ページへ"}
              isPrimary={true}
              onClick={() => {
                void router.push(`/detail/${router.query.id}`);
              }}
            />
          )}
        </Stack>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {event.name}
        </Typography>
        <TextField
          label="表示名"
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={NameText}
          onChange={(e) => {
            setNameText(e.target.value);
          }}
          required
        />
        {/* 候補リスト */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption">日時</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">参加可否</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {event.units.map((unit) => {
                const start = dayjs(unit.startsAt);
                const end = dayjs(unit.startsAt).add(
                  event.unitDuration,
                  "seconds",
                );
                return (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {start.format("MM / DD")}
                        <br />
                        {start.format("HH:mm")}〜{end.format("HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell className={`${Styles.wrapper}`}>
                      <RadioGroup
                        sx={{ flexDirection: "row" }}
                        onChange={(e) => {
                          const value = checklist[unit.id];
                          setChecklist({
                            ...checklist,
                            [unit.id]: {
                              ...value,
                              val: e.target.value as IAvailability,
                              block: value.block,
                            },
                          });
                        }}
                        value={checklist[unit.id]?.val ?? "available"}
                      >
                        <FormControlLabel
                          value="available"
                          control={
                            <Radio
                              icon={<PanoramaFishEyeIcon />}
                              checkedIcon={
                                <>
                                  <PanoramaFishEyeIcon
                                    sx={{
                                      color: "white",
                                    }}
                                  />
                                  <Brightness1Icon
                                    sx={{
                                      position: "absolute",
                                      color: "primary.main",
                                      zIndex: -1,
                                      fontSize: 48,
                                    }}
                                  />
                                </>
                              }
                            />
                          }
                          label=""
                        />
                        <FormControlLabel
                          value="maybe"
                          control={
                            <Radio
                              icon={<ChangeHistoryIcon />}
                              checkedIcon={
                                <>
                                  <ChangeHistoryIcon
                                    sx={{
                                      color: "white",
                                      mb: 0.3,
                                    }}
                                  />
                                  <Brightness1Icon
                                    sx={{
                                      position: "absolute",
                                      color: "primary.main",
                                      zIndex: -1,
                                      fontSize: 48,
                                    }}
                                  />
                                </>
                              }
                            />
                          }
                          label=""
                        />
                        <FormControlLabel
                          value="unavailable"
                          control={
                            <Radio
                              icon={<CloseIcon />}
                              checkedIcon={
                                <>
                                  <CloseIcon
                                    sx={{
                                      color: "white",
                                    }}
                                  />
                                  <Brightness1Icon
                                    fontSize="large"
                                    sx={{
                                      position: "absolute",
                                      color: "primary.main",
                                      zIndex: -1,
                                      fontSize: 48,
                                    }}
                                  />
                                </>
                              }
                            />
                          }
                          label=""
                        />
                      </RadioGroup>
                      {checklist[unit.id]?.val === "available" &&
                        checklist[unit.id]?.block && (
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
            onClick={() => void Submit()}
          />
        </Stack>
      </Stack>
    </>
  );
};

const getDefaultName = (event: IEvent) => {
  const answer = getMyAnswer(event);
  if (!event.yourAnswerId || !answer) return "";
  return answer?.userNickname ?? "";
};

const getMyAnswer = (event: IEvent): IUserAnswer | undefined => {
  return event.userAnswers.find((a) => a.id === event.yourAnswerId);
};

export { GuestPageBody };
