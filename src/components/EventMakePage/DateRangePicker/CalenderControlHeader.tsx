import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";

type Props = {
  headerLabel: string;
  addMonth: () => void;
  subtractMonth: () => void;
};

/**
 * カレンダーの操作・表示部
 *
 * @param headerLabel 年月のラベル
 * @param addMonth 月を進めるhandler
 * @param subtractMonth 月を戻すhandler
 */
export const CalenderControlHeader = ({
  headerLabel,
  addMonth,
  subtractMonth,
}: Props) => {
  return (
    <Grid container columns={7} alignItems="center">
      <Grid item xs={3}>
        <Typography
          variant="h6"
          sx={{
            ml: 2,
          }}
        >
          {headerLabel}
        </Typography>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="end"
          spacing={2}
        >
          <IconButton onClick={subtractMonth}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={addMonth}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
