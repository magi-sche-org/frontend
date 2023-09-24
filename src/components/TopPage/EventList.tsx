import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import type { IRequestResult } from "@/@types/api/request";
import type { UserEventItem } from "@/@types/user";
import { useUser } from "@/hooks/user";
import { requests } from "@/libraries/requests";

import { ListButton } from "./ListButton";
import { VerticalCard } from "./VerticalCard";

const FOLDING_EVENT_LIMIT = 9999;

export const EventList = () => {
  const [eventList, setEventList] = useState<UserEventItem[]>([]);
  const [listPosition, setListPosition] = useState(0);
  const { user } = useUser();
  useEffect(() => {
    if (typeof window !== "object") return;
    void (async () => {
      const req =
        await requests<IRequestResult<UserEventItem[]>>("/user/events");
      if (req.statusCode !== 200) return;
      setEventList(req.data);
    })();
  }, [user]);

  /**
   * イベントリストの位置の上下
   * @param isUp
   */
  const handleChangeListPosition = (isUp: boolean) => {
    isUp
      ? setListPosition(listPosition - 1)
      : setListPosition(listPosition + 1);
  };

  // 一定数以上のイベントがある場合は折りたたむ
  const isNeedsFolding = eventList.length > FOLDING_EVENT_LIMIT;

  // スタート・エンド位置
  const startPosition = listPosition * FOLDING_EVENT_LIMIT;
  const endPosition = startPosition + FOLDING_EVENT_LIMIT;

  // スクロールアップ可能・スクロールダウン可能
  const isScrollUp = isNeedsFolding && listPosition > 0;
  const isScrollDown =
    isNeedsFolding &&
    (listPosition + 1) * FOLDING_EVENT_LIMIT < eventList.length;

  return (
    <Stack spacing={1.5}>
      {eventList.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: "white", textAlign: "center" }}
        >
          ここにはまだなにもありません
        </Typography>
      )}
      {isScrollUp ? (
        <VerticalCard isUp onClick={handleChangeListPosition} />
      ) : null}
      {eventList.slice(startPosition, endPosition).map((event) => {
        return (
          <EventCard
            key={event.id + event.name}
            name={event.name}
            eventId={event.id}
          />
        );
      })}
      {isScrollDown ? (
        <VerticalCard isUp={false} onClick={handleChangeListPosition} />
      ) : null}
    </Stack>
  );
};

const EventCard = ({ name, eventId }: { name: string; eventId: string }) => {
  return <ListButton text={name} page={`/detail/${eventId}`} />;
};
