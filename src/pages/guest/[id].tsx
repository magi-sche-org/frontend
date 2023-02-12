import GuestPageBody from "@/components/GestPage/GestPageBody";
import { eventClient } from "@/service/api-client/client";
import { GetEventRequest, GetEventResponse } from "@/service/api-client/protocol/event_pb";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {getToken} from "@/libraries/token";

const GuestPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [eventDetail, setEventDetail] = useState<GetEventResponse.AsObject | undefined>(undefined);
  const { id } = router.query;
  useEffect(() => {
    const request = new GetEventRequest();
    if (id === undefined || Array.isArray(id)) {
      return;
    }
    request.setId(id);
    request.setToken(getToken(localStorage));
    eventClient
      .getEvent(request, null)
      .then((res) => {
        setEventDetail(res.toObject());
      })
      .catch((e) => {
        enqueueSnackbar("イベント情報を取得できませんでした", {
          autoHideDuration: 2000,
          variant: "error"
        });
      });
  }, [id]);
  return <>{eventDetail && <GuestPageBody eventDetail={eventDetail} />}</>;
};

export default GuestPage;
