import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import { Answer, GetEventResponse } from "@/service/api-client/protocol/event_pb";
import { date2time } from "@/libraries/time";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import { getEventStorage } from "@/libraries/eventStorage";
import { useMemo } from "react";
type GuestPageBodyProps = {
  eventDetail: GetEventResponse;
};

const DetailPageBody = ({ eventDetail }: GuestPageBodyProps) => {
  const router = useRouter();
  const list: { [key: string]: { available: number; unavailable: number } } = {};
  const isAnswered = getEventStorage().reduce(
    (pv: boolean, val) => (val.answered && val.id === eventDetail.getId()) || pv,
    false
  );
  // key: timeStamp value: その時間の参加者の可否と名前
  const participantsAvailability: {
    [key: number]: { name: string; availability: boolean }[];
  } = useMemo(() => {
    const keys = eventDetail.getProposedstarttimeList().map((startTime) => startTime);
    const res: { [key: string]: { name: string; availability: boolean }[] } = {};
    keys.forEach((key) => {
      const participants = eventDetail.getAnswersList().map((answer) => {
        const name = answer.getName();
        const availability = answer
          .getScheduleList()
          .filter((schedule) => schedule.getStarttime()?.getSeconds() === key.getSeconds());
        if (availability.length === 1) {
          return {
            name,
            availability:
              availability[0].getAvailability() === Answer.ProposedSchedule.Availability.AVAILABLE
          };
        }
      });
      const a = participants.filter(isParticipantsInfo);
      res[key.getSeconds()] = a;
    });
    return res;
  }, [eventDetail]);

  for (const answer of eventDetail.getAnswersList()) {
    for (const schedule of answer.getScheduleList()) {
      const key = schedule.getStarttime()?.getSeconds() || 0;
      if (!list[key]) {
        list[key] = { available: 0, unavailable: 0 };
      }
      if (schedule.getAvailability() === Answer.ProposedSchedule.Availability.AVAILABLE) {
        list[key].available++;
      } else {
        list[key].unavailable++;
      }
    }
  }

  return (
    <>
      {/* タイトル表示*/}
      <Stack direction='column' sx={{ p: 3, mt: 2 }}>
        <Stack sx={{ mx: 10 }}>
          <Button
            text={`${isAnswered ? "編集" : "回答"}ページへ`}
            isPrimary={true}
            onClick={() => {
              router.push(`/guest/${router.query.id}`);
            }}
          />
        </Stack>
        <Typography variant='h6' sx={{ textAlign: "center", my: 3 }}>
          {eventDetail.getName()}
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
                  <Typography variant='caption'>参加可能</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='caption'>参加不可</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(list).map((ts) => {
                const val = list[ts];
                const start = new Date(Number(ts) * 1000);
                const end = new Date(
                  (Number(ts) + (eventDetail.getDuration()?.getSeconds() || 0)) * 1000
                );
                return (
                  <Tooltip
                    key={ts}
                    title={getParticipantsText(participantsAvailability[Number(ts)])}
                    enterTouchDelay={0}
                  >
                    <TableRow sx={determineRowColor(val)}>
                      <TableCell>
                        <Typography variant='body1'>
                          {start.getMonth() + 1}&thinsp;/&thinsp;
                          {start.getDate()}
                          &emsp;
                          {date2time(start)}〜{date2time(end)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1' sx={{ ml: 1 }}>
                          {val.available}人
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1' sx={{ ml: 1 }}>
                          {val.unavailable}人
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

const determineRowColor = (val: { available: number; unavailable: number }) => {
  const participantsNumber = val.available + val.unavailable;
  if (participantsNumber === val.available) {
    return {
      // 参加多い
      backgroundColor: "#e2fde1"
    };
  }

  if (val.unavailable <= 2) {
    return {
      // 参加少ない
      backgroundColor: "white"
    };
  }
};

function isParticipantsInfo(
  p: { name: string; availability: boolean } | undefined
): p is { name: string; availability: boolean } {
  return p !== undefined;
}
const getParticipantsText = (participantsArray: { name: string; availability: boolean }[]) => {
  const resText = participantsArray.map((p) => (
    <span key={p.name}>
      {`${p.name} ${p.availability ? "○" : "×"}`}
      <br />
    </span>
  ));
  return resText;
};
export { DetailPageBody };
