import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useMemo } from "react";

import type {
  IAvailability,
  IDateAnswer,
  IDateAnswerItem,
  IDateAnswers,
  IEventResponse,
} from "@/@types/api/event";
import { Button } from "@/components/Button";
import { groupAnswerByStartsTime } from "@/libraries/event";
import { getEventStorage } from "@/libraries/eventStorage";
type Props = {
  event: IEventResponse;
};

const availabilityMap: { [availability in IAvailability]: string } = {
  available: "参加可能",
  unavailable: "参加不可",
  maybe: "不明",
};

const DetailPageBody: FC<Props> = ({ event }) => {
  const router = useRouter();
  const isAnswered = getEventStorage().reduce(
    (pv: boolean, val) => (val.yourAnswerId && val.id === event.id) || pv,
    false,
  );
  const participantsAvailability: IDateAnswers = useMemo(
    () => groupAnswerByStartsTime(event.userAnswers),
    [event],
  );
  return (
    <>
      {/* タイトル表示*/}
      <Stack direction="column" sx={{ p: 3, mt: 2 }}>
        <Stack sx={{ mx: 10 }}>
          <Link href={`/guest/${router.query.id}`}>
            <Button
              text={`${isAnswered ? "編集" : "回答"}ページへ`}
              isPrimary={true}
            />
          </Link>
        </Stack>
        <Typography variant="h6" sx={{ textAlign: "center", my: 3 }}>
          {event.name}
        </Typography>
        {/* 候補リスト */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption">日時</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">可</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">不明</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">不可</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(participantsAvailability).map((unit) => {
                const start = dayjs(unit.startsTime);
                const end = dayjs(unit.startsTime).add(
                  event.unitDuration,
                  "seconds",
                );

                return (
                  <Tooltip
                    key={unit.startsTime}
                    title={getParticipantsText(unit.answers)}
                    enterTouchDelay={0}
                  >
                    <TableRow sx={determineRowColor(unit)}>
                      <TableCell>
                        <Typography variant="body1">
                          {start.format("MM / DD")}
                          <br />
                          {start.format("HH:mm")}〜{end.format("HH:mm")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1 }}
                          whiteSpace={"nowrap"}
                        >
                          {unit.counts.available}人
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1 }}
                          whiteSpace={"nowrap"}
                        >
                          {unit.counts.maybe}人
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1 }}
                          whiteSpace={"nowrap"}
                        >
                          {unit.counts.unavailable}人
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
};

const determineRowColor = (
  val: IDateAnswer,
): { backgroundColor: string } | undefined => {
  if (val.counts.total === val.counts.available) {
    return {
      backgroundColor: "#e2fde1",
    };
  }

  if (val.counts.unavailable <= 2) {
    return {
      // 参加少ない
      backgroundColor: "white",
    };
  }
};
const getParticipantsText = (answers: IDateAnswerItem[]): string => {
  let result = "";
  for (const answer of answers) {
    result += `${answer.name} : ${availabilityMap[answer.availability]}\n`;
  }
  return result;
};
export { DetailPageBody };
