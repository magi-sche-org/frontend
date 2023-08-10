import { DetailPageBody } from "@/components/detailPage/detailPageBody";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import Head from "next/head";
import { IEvent } from "@/@types/api/event";
import { getEvent } from "@/libraries/api/events";

const DetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [eventDetail, setEventDetail] = useState<IEvent | undefined>(undefined);
  const { id } = router.query;
  useEffect(() => {
    if (typeof id !== "string") return;
    (async () => {
      try {
        const event = await getEvent(id);
        setEventDetail(event);
      } catch (e) {
        enqueueSnackbar("イベント情報を取得できませんでした", {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    })();
  }, [id]);
  if (!eventDetail) return <></>;
  return (
    <>
      <Head>
        <title>{eventDetail.name} - Magi-Sche</title>
      </Head>
      <DetailPageBody event={eventDetail} />
    </>
  );
};

export default DetailPage;
