import type { Dayjs } from "dayjs";
import type { CSSProperties, FC, PointerEvent, UIEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { TSchedule } from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";
import { ScrollDetector } from "@/components/calendar/timeline-wrapper/scroll-detector";
import { CalendarTimelineSelectingIndicator } from "@/components/calendar/timeline-wrapper/selecting-indicator";

import { CalendarTimelineWrapper } from "./container";
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
  const innerRef = useRef<HTMLDivElement>(null);
  //todo: 選択範囲をstateに保存する
  // const [selectedDate, setSelectedDate] = useState<
  //   Partial<TSelectionRange> | undefined
  // >(undefined);
  const [selectingDate, setSelectingDate] = useState<Partial<TSelectionRange>>(
    {},
  );
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

  const onMouseDown = (e: PointerEvent<HTMLDivElement>): void => {
    const pos1 = getDate(e);
    setSelectingDate((pv) => ({ ...pv, pos1 }));
  };

  const onMouseMove = (e: PointerEvent<HTMLDivElement>): void => {
    if (!selectingDate.pos1) return;
    const pos2 = getDate(e);
    setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onMouseUp = (e: PointerEvent<HTMLDivElement>): void => {
    if (!selectingDate?.pos1) return;
    const pos2 = getDate(e);
    if (!pos2) return;
    setSelectingDate({});
    dispatchOnChange(selectingDate.pos1, pos2);
  };

  const getDate = (e: PointerEvent<HTMLDivElement>): Dayjs | undefined => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left + scrollPosition;
    const dateOffset = Math.floor(x / cardWidth);
    const y = (e.clientY - rect.top) / rect.height;
    const hour = Math.floor(y * 24);
    const minute = Math.floor((y * 24 - hour) * 2) * 30;
    return startDate
      .add(dateOffset, "day")
      .set("hour", hour)
      .set("minute", minute)
      .set("second", 0)
      .set("millisecond", 0);
  };

  const scrollContainerStyle: CSSProperties = {
    width: ((containerRef.current?.clientWidth ?? 1920) * (count + 2)) / count,
  };

  const scroll = (isLeft: boolean): void => {
    if (!selectingDate.pos1) return;
    innerRef.current?.scrollTo({
      left: isLeft
        ? innerRef.current?.scrollLeft - cardWidth * 3
        : innerRef.current?.scrollLeft + cardWidth * 3,
      behavior: "smooth",
    });
  };

  return (
    <div className={Styles.wrapper}>
      <CalendarTimelineIndicator />
      <div
        className={Styles.container}
        ref={containerRef}
        onPointerDown={onMouseDown}
        onPointerMove={onMouseMove}
        onPointerUp={onMouseUp}
      >
        <div className={Styles.inner} onScroll={onScroll} ref={innerRef}>
          <div
            className={Styles.scrollWrapper}
            style={{
              width: clientWidth * 10,
              left: leftOffset,
            }}
          >
            <div
              style={scrollContainerStyle}
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
          {selectingDate.pos1 && selectingDate.pos2 && (
            <CalendarTimelineSelectingIndicator
              pos1={selectingDate.pos1}
              pos2={selectingDate.pos2}
              cardWidth={cardWidth}
            />
          )}
        </div>
        <ScrollDetector type={"left"} scroll={() => scroll(true)} />
        <ScrollDetector type={"right"} scroll={() => scroll(false)} />
      </div>
    </div>
  );
};

export { CalendarWrapper };
