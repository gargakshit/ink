import type { NextApiRequest, NextApiResponse } from "next";

import { exploreInks } from "@/lib/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return await get(req, res);
  }

  return res.status(405).send("Method not allowed");
}

async function get(_: NextApiRequest, res: NextApiResponse) {
  return res.json(await exploreInks());
}
