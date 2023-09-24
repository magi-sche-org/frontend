import Head from "next/head";
import { useRouter } from "next/router";

import { DetailPageBody } from "@/components/detailPage/detailPageBody";
import { useEvent } from "@/hooks/event";

const DetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { event, error } = useEvent(id as string);
  if (!event) return <>{error?.message}</>;
  return (
    <>
      <Head>
        <title>{event.name} - Magi-Sche</title>
      </Head>
      <DetailPageBody event={event} />
    </>
  );
};

export default DetailPage;
