import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import type { TSelectionRange } from "@/@types/selection";
import { PageTitle } from "@/components/common/PageTitle";
import { EventMakePageBody } from "@/components/EventMakePage/EventMakePageBody";
import { Preview } from "@/components/preview/preview";
import Styles from "@/styles/create.module.scss";

const EventMakePage: FC = () => {
  const [args, setArgs] = useState<
    | {
        ranges: TSelectionRange[];
        duration: number;
      }
    | undefined
  >();
  return (
    <div className={Styles.wrapper}>
      <PageTitle>イベント作成</PageTitle>
      <Accordion expanded={!args}>
        <AccordionSummary onClick={() => setArgs(undefined)}>
          日時の選択
        </AccordionSummary>
        <AccordionDetails>
          <EventMakePageBody
            onSubmit={(ranges, duration) => {
              setArgs({ ranges, duration });
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={!!args}>
        <AccordionSummary onClick={() => setArgs(undefined)}>
          作成プレビュー
        </AccordionSummary>
        <AccordionDetails>
          {args && <Preview ranges={args.ranges} duration={args.duration} />}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EventMakePage;
