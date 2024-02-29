import type { Dayjs } from "dayjs";
import type {
  CSSProperties,
  FC,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  UIEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import type { TSchedule } from "@/@types/schedule";
import type { TSelectionRange } from "@/@types/selection";
import { ScrollBlocker } from "@/components/calendar/timeline-wrapper/scroll-blocker";
import { ScrollDetector } from "@/components/calendar/timeline-wrapper/scroll-detector";
import { CalendarTimelineSelectingIndicator } from "@/components/calendar/timeline-wrapper/selecting-indicator";
import { isTouchDevice } from "@/libraries/isTouchDevice";

import { CalendarTimelineWrapper } from "./container";
import { CalendarTimelineIndicator } from "./indicator";
import Styles from "./wrapper.module.scss";

type Props = {
  count: number;
  startDate: Dayjs;
  schedules?: TSchedule[];
  selectedRanges: TSelectionRange[];
  dispatchOnChange: (range: TSelectionRange) => void;
  selectingColor?: string;
};

const minWidth = 90;

const CalendarWrapper: FC<Props> = ({
  count: _count,
  startDate,
  schedules,
  selectedRanges,
  dispatchOnChange,
  selectingColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [selectingDate, setSelectingDate] = useState<Partial<TSelectionRange>>(
    {},
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientWidth, setClientWidth] = useState(1920);
  const [scrollBlock, setScrollBlock] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(32);

  useEffect(() => {
    if (!containerRef.current) return;
    const onResize = (): void => {
      setClientWidth(containerRef.current?.clientWidth ?? 1920);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(containerRef.current);
    setHeaderHeight(isTouchDevice() ? 60 : 32);
    return () => observer.disconnect();
  }, []);
  const count = Math.min(_count, Math.floor(clientWidth / minWidth));
  const cardWidth =
    clientWidth / Math.min(count, Math.floor(clientWidth / minWidth));
  const offset = Math.floor(scrollPosition / cardWidth);
  const leftOffset = offset * cardWidth;
  const start = startDate.add(offset, "day").set("hour", 0).set("minute", 0);

  const onScroll = (e: UIEvent<HTMLDivElement>): void => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  useEffect(() => {
    if (selectingDate.pos1) {
      document.addEventListener("mouseup", onMouseUp, { once: true });
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchend", onTouchEnd, { once: true });
      document.addEventListener("touchmove", onTouchMove);
    }
    return () => {
      cleanUp();
    };
  }, [selectingDate]);

  useEffect(() => {
    document.documentElement.style.overflow = scrollBlock ? "hidden" : "";
  }, [scrollBlock]);

  const cleanUp = (): void => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>): void => {
    const pos1 = getDate(e.clientX, e.clientY);
    setSelectingDate((pv) => ({ ...pv, pos1 }));
  };

  const onMouseMove = (
    e: ReactMouseEvent<HTMLDivElement> | MouseEvent,
  ): void => {
    if (!selectingDate.pos1) return;
    const pos2 = getDate(e.clientX, e.clientY);
    setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onMouseUp = (e: ReactMouseEvent<HTMLDivElement> | MouseEvent): void => {
    setSelectingDate({});
    cleanUp();
    if (!selectingDate?.pos1) return;
    const pos2 = getDate(e.clientX, e.clientY);
    if (!pos2) return;
    dispatchOnChange({ pos1: selectingDate.pos1, pos2 });
  };

  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>): void => {
    const touchItem = e.touches.item(0);
    if (!touchItem) return;
    const pos1 = getDate(touchItem.clientX, e.touches.item(0).clientY);
    if (!pos1) return;
    setSelectingDate((pv) => ({ ...pv, pos1 }));
    setScrollBlock(true);
  };

  const onTouchMove = (
    e: ReactTouchEvent<HTMLDivElement> | TouchEvent,
  ): void => {
    const touchItem = e.touches.item(0);
    if (!selectingDate.pos1 || !touchItem) return;
    const pos2 = getDate(touchItem.clientX, touchItem.clientY);
    setSelectingDate((pv) => ({ ...pv, pos2 }));
  };

  const onTouchEnd = (
    e: ReactTouchEvent<HTMLDivElement> | TouchEvent,
  ): void => {
    cleanUp();
    setScrollBlock(false);
    if (!selectingDate?.pos1) return;
    const touchItem = e.touches.item(0);
    setSelectingDate({});
    if (!touchItem) {
      if (!selectingDate.pos1 || !selectingDate.pos2) return;
      dispatchOnChange({ pos1: selectingDate.pos1, pos2: selectingDate.pos2 });
      return;
    }
    const pos2 = getDate(touchItem.clientX, touchItem.clientY);
    if (!pos2) return;
    dispatchOnChange({ pos1: selectingDate.pos1, pos2 });
  };

  const getDate = (clientX: number, clientY: number): Dayjs | undefined => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left + scrollPosition;
    const dateOffset = Math.floor(x / cardWidth);
    const _y =
      (clientY - rect.top - headerHeight) / (rect.height - headerHeight);
    const y = _y < 0 ? 0 : _y > 1 ? 1 : _y;
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
      <CalendarTimelineIndicator headerHeight={headerHeight} />
      <div className={Styles.container} ref={containerRef}>
        <div
          className={`${Styles.inner} ${scrollBlock ? Styles.scrollBlock : ""}`}
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
                    headerHeight={headerHeight}
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
                headerHeight={headerHeight}
                color={selectingColor}
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
                headerHeight={headerHeight}
              />
            );
          })}
        </div>
        <ScrollDetector
          type={"left"}
          scroll={() => scroll(true)}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        />
        <ScrollDetector
          type={"right"}
          scroll={() => scroll(false)}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        />
      </div>
    </div>
  );
};

export { CalendarWrapper };
