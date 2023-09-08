import { IAvailability, IEventTimeDuration } from "@/@types/api/event";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";
import Styles from "../GuestPage/GuestPageBody.module.scss";
import { IAnswerList } from "./CandidateDatePreview";

type Props = {
  eventTimeDuration: IEventTimeDuration;
  checkList: IAnswerList;
  setCheckList: (checkList: IAnswerList) => void;
};

export const InputSchedule: FC<Props> = ({
  checkList,
  setCheckList,
  eventTimeDuration,
}) => {
  console.log(checkList);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="caption">日時</Typography>
            </TableCell>
            <TableCell>
              {/* TODO: ラベル変更 */}
              <Typography variant="caption">候補日にする</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(checkList).map(([unitStartTime, availability]) => {
            const start = dayjs(unitStartTime);
            const end = dayjs(unitStartTime).add(eventTimeDuration, "seconds");
            return (
              <TableRow key={unitStartTime}>
                <TableCell>
                  <Typography variant="body1">
                    {start.format("MM/DD")}
                    &emsp;
                    {start.format("HH:mm")}〜{end.format("HH:mm")}
                  </Typography>
                </TableCell>
                <TableCell className={`${Styles.wrapper}`}>
                  <RadioGroup
                    value={availability}
                    onChange={(e) => {
                      const newCheckList = { ...checkList };
                      console.log(e.target.value, unitStartTime);
                      newCheckList[unitStartTime] = e.target
                        .value as IAvailability;
                      console.log("set: ", newCheckList);
                      setCheckList(newCheckList);
                    }}
                  >
                    <FormControlLabel
                      value="available"
                      control={<Radio />}
                      label="参加可能"
                    />
                    <FormControlLabel
                      value="maybe"
                      control={<Radio />}
                      label="不明"
                    />
                    <FormControlLabel
                      value="unavailable"
                      control={<Radio />}
                      label="参加不可"
                    />
                  </RadioGroup>
                  {/* {checkList[unit.id]?.val && checkList[unit.id]?.block && (
                    <span className={Styles.info}>
                      <Typography variant="caption">重複</Typography>
                    </span>
                  )} */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
