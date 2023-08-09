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
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import { getEventStorage } from "@/libraries/eventStorage";
import { useMemo } from "react";
import {
  IAvailability,
  IDateAnswers,
  IDateAnswerItem,
  IEvent,
  IDateAnswer,
} from "@/@types/api/event";
import { groupAnswerByStartsTime } from "@/libraries/event";
import Link from "next/link";
import dayjs from "dayjs";
type props = {
  event: IEvent;
};

const availabilityMap: { [availability in IAvailability]: string } = {
  available: "参加可能",
  unavailable: "参加不可",
  maybe: "不明",
};

const DetailPageBody = ({ event }: props) => {
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
                  <Typography variant="caption">参加可能</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">不明</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">参加不可</Typography>
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
                          {start.format("MM / DD[&emsp;]HH:mm")}〜
                          {end.format("HH:mm")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {unit.counts.available}人
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {unit.counts.maybe}人
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ ml: 1 }}>
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

const determineRowColor = (val: IDateAnswer) => {
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
const getParticipantsText = (answers: IDateAnswerItem[]) => {
  let result = "";
  for (const answer of answers) {
    result += `${answer.name} : ${availabilityMap[answer.availability]}\n`;
  }
  return result;
};
export { DetailPageBody };
