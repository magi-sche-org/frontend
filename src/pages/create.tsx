import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import { PageTitle } from "@/components/common/PageTitle";
import { EventMakePageBody } from "@/components/EventMakePage/EventMakePageBody";
import { EventMakePageBodyLegacy } from "@/components/EventMakePage/EventMakePageBodyLegacy";
import { Preview } from "@/components/preview/preview";
import { useIsMobile } from "@/hooks/isMobile";
import Styles from "@/styles/create.module.scss";

const EventMakePage: FC = () => {
  const isMobile = useIsMobile();
  const [args, setArgs] = useState<
    | {
        startTimes: Record<string, boolean>;
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
          {isMobile ? (
            <EventMakePageBodyLegacy
              onSubmit={(startTimes, duration) => {
                setArgs({ startTimes, duration });
              }}
            />
          ) : (
            <EventMakePageBody
              onSubmit={(startTimes, duration) => {
                setArgs({ startTimes, duration });
              }}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={!!args}>
        <AccordionSummary onClick={() => setArgs(undefined)}>
          作成プレビュー
        </AccordionSummary>
        <AccordionDetails>
          {args && (
            <Preview startTimes={args.startTimes} duration={args.duration} />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EventMakePage;
