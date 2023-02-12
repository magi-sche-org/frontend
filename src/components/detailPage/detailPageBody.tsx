import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import {
  Answer,
  GetEventResponse,
} from "@/service/api-client/protocol/event_pb";
import {date2time} from "@/libraries/time";
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
  
  return (
    <>
      {/* タイトル表示*/}
      <Stack direction="column" sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          {eventDetail.getName()}
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
                  <Typography variant="caption">参加不可</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(list).map((ts) => {
                const val = list[ts];
                const start = new Date(Number(ts)*1000);
                const end = new Date((Number(ts)+(eventDetail.getDuration()?.getSeconds()||0))*1000)
                return (
                  <TableRow key={ts}>
                    <TableCell>
                      <Typography variant="body1">
                        {start.getMonth() + 1}&thinsp;/&thinsp;
                        {start.getDate()}
                        &emsp;
                        {date2time(start)}〜
                        {date2time(end)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {val.available}人
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {val.unavailable}人
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

export {DetailPageBody};
