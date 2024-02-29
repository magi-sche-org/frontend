import type { Dayjs } from "dayjs";
import type {
  CSSProperties,
  FC,
  PointerEvent,
  TouchEvent,
  UIEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import type { TSchedule } from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";
import { ScrollBlocker } from "@/components/calendar/timeline-wrapper/scroll-blocker";
import { ScrollDetector } from "@/components/calendar/timeline-wrapper/scroll-detector";
import { CalendarTimelineSelectingIndicator } from "@/components/calendar/timeline-wrapper/selecting-indicator";

import { CalendarTimelineWrapper } from "./container";
import { CalendarTimelineIndicator } from "./indicator";
import Styles from "./wrapper.module.scss";

type Props = {
  count: number;
  startDate: Dayjs;
  schedules?: TSchedule[];
  selectedRanges: TSelectionRange[];
  dispatchOnChange: (range: TSelectionRange) => void;
};

const CalendarWrapper: FC<Props> = ({
  count,
  startDate,
  schedules,
  selectedRanges,
  dispatchOnChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
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
    const pos1 = getDate(e.clientX, e.clientY);
    setSelectingDate((pv) => ({ ...pv, pos1 }));
  };

  const onMouseMove = (e: PointerEvent<HTMLDivElement>): void => {
    if (!selectingDate.pos1) return;
    const pos2 = getDate(e.clientX, e.clientY);
    setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onMouseUp = (e: PointerEvent<HTMLDivElement>): void => {
    if (!selectingDate?.pos1) return;
    const pos2 = getDate(e.clientX, e.clientY);
    if (!pos2) return;
    setSelectingDate({});
    dispatchOnChange({ pos1: selectingDate.pos1, pos2 });
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    const touchItem = e.touches.item(0);
    if (!touchItem) return;
    const pos1 = getDate(touchItem.clientX, e.touches.item(0).clientY);
    setSelectingDate((pv) => ({ ...pv, pos1 }));
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
    const touchItem = e.touches.item(0);
    if (!selectingDate.pos1 || !touchItem) return;
    const pos2 = getDate(touchItem.clientX, e.touches.item(0).clientY);
    setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
    if (!selectingDate?.pos1) return;
    if (!e.touches.item(0) && selectingDate.pos1 && selectingDate.pos2) {
      dispatchOnChange({ pos1: selectingDate.pos1, pos2: selectingDate.pos2 });
      setSelectingDate({});
      return;
    }
    const pos2 = getDate(e.touches.item(0).clientX, e.touches.item(0).clientY);
    if (!pos2) return;
    setSelectingDate({});
    dispatchOnChange({ pos1: selectingDate.pos1, pos2 });
  };

  const getDate = (clientX: number, clientY: number): Dayjs | undefined => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left + scrollPosition;
    const dateOffset = Math.floor(x / cardWidth);
    const y = (clientY - rect.top) / rect.height;
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
      <div className={Styles.container} ref={containerRef}>
        <div
          className={Styles.inner}
          ref={innerRef}
          onScroll={onScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
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
            <>
              <CalendarTimelineSelectingIndicator
                pos1={selectingDate.pos1}
                pos2={selectingDate.pos2}
                cardWidth={cardWidth}
              />
              <ScrollBlocker />
            </>
          )}
          {selectedRanges.map((range) => {
            return (
              <CalendarTimelineSelectingIndicator
                key={range.pos1.toISOString()}
                pos1={range.pos1}
                pos2={range.pos2}
                cardWidth={cardWidth}
              />
            );
          })}
        </div>
        <ScrollDetector type={"left"} scroll={() => scroll(true)} />
        <ScrollDetector type={"right"} scroll={() => scroll(false)} />
      </div>
    </div>
  );
};

export { CalendarWrapper };
