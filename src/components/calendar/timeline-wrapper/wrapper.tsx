import type { Dayjs } from "dayjs";
import type { FC, UIEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { TSchedule } from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";

import { CalendarTimelineWrapper } from "./container";
import { SelectingDateContext } from "./context";
import { CalendarTimelineIndicator } from "./indicator";
import Styles from "./wrapper.module.scss";

type Props = {
  count: number;
  startDate: Dayjs;
  schedules?: TSchedule[];
  dispatchOnChange: (pos1: Dayjs, pos2: Dayjs) => void;
};

const CalendarWrapper: FC<Props> = ({
  count,
  startDate,
  schedules,
  dispatchOnChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectingDate, setSelectingDate] = useState<
    Partial<TSelectionRange> | undefined
  >(undefined);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientWidth, setClientWidth] = useState(1920);

  useEffect(() => {
    if (!containerRef.current) return;
    const onResize = (): void => {
      setClientWidth(containerRef.current?.clientWidth ?? 1920);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cardWidth = clientWidth / count;
  const offset = Math.floor(scrollPosition / cardWidth);
  const leftOffset = offset * cardWidth;
  const start = startDate.add(offset, "day");

  const onScroll = (e: UIEvent<HTMLDivElement>): void => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  const contextValue = useMemo(
    () => ({ selectingDate, setSelectingDate, dispatchOnChange }),
    [selectingDate, setSelectingDate, dispatchOnChange],
  );

  return (
    <SelectingDateContext.Provider value={contextValue}>
      <div className={Styles.wrapper}>
        <CalendarTimelineIndicator />
        <div
          className={Styles.container}
          onScroll={onScroll}
          ref={containerRef}
        >
          <div
            className={Styles.scrollWrapper}
            style={{
              width: clientWidth * 10,
              left: leftOffset,
            }}
          >
            <div
              style={{
                width:
                  ((containerRef.current?.clientWidth ?? 1920) * (count + 2)) /
                  count,
              }}
              className={Styles.scrollContainer}
            >
              {[...(Array(count + 2) as void[])].map((_, index) => {
                const date = start.add(index, "day");
                return (
                  <CalendarTimelineWrapper
                    key={date.toISOString()}
                    date={date}
                    schedules={schedules}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SelectingDateContext.Provider>
  );
};

export { CalendarWrapper };
