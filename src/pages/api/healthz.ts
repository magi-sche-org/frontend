import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

function healthz(_: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json({ message: "OK" });
}

export default healthz;
