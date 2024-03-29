import Head from "next/head";
import { useRouter } from "next/router";
import type { FC } from "react";

import { GuestPageBody } from "@/components/GuestPage/GuestPageBody";
import { useEvent } from "@/hooks/event";

const GuestPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { event, error } = useEvent(id as string);
  if (!event) return <>{error?.message}</>;
  return (
    <>
      <Head>
        <title>{event.name} - Magi-Sche</title>
      </Head>
      <GuestPageBody event={event} />
    </>
  );
};

export default GuestPage;
