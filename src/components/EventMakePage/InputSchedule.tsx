import "dayjs/locale/ja";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import type { FC } from "react";

import type { IEventTimeDuration } from "@/@types/api/event";

import Styles from "../GuestPage/GuestPageBody.module.scss";

type Props = {
  eventTimeDuration: IEventTimeDuration;
  checkList: Record<string, boolean>;
  setCheckList: (checkList: Record<string, boolean>) => void;
};

export const InputSchedule: FC<Props> = ({
  checkList,
  setCheckList,
  eventTimeDuration,
}) => {
  dayjs.locale("ja");
  return (
    <TableContainer>
      <Stack spacing={1}>
        <Typography variant="h5">候補編集</Typography>
        <Typography>チェックを外すとその候補が無効になります</Typography>
      </Stack>
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
          {Object.entries(checkList).map(([unitStartTime, checked]) => {
            const start = dayjs(unitStartTime);
            const end = dayjs(unitStartTime).add(eventTimeDuration, "seconds");
            return (
              <TableRow key={unitStartTime}>
                <TableCell>
                  <Typography variant="body1">
                    {`${start.format("MM/DD")}(${start.format("ddd")}) `}
                    {start.format("HH:mm")}〜{end.format("HH:mm")}
                  </Typography>
                </TableCell>
                <TableCell className={`${Styles.wrapper}`}>
                  <Checkbox
                    checked={checked}
                    onChange={(_, value) => {
                      const newCheckList = { ...checkList };
                      newCheckList[unitStartTime] = value;
                      setCheckList(newCheckList);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
