import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendUpdateResult, updateInk } from "@/lib/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    return await patch(req, res);
  }

  return res.status(405).send("Method not allowed");
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const id = req.query.id;
  const source = req.body.source;
  const rendered = req.body.rendered;
  const name = req.body.name;

  if (
    !id ||
    (source === undefined && rendered === undefined && name === undefined)
  ) {
    return res.status(400).send("Bad request");
  }

  return sendUpdateResult(
    res,
    await updateInk(session, Number.parseInt(id as string), {
      source,
      rendered,
      name,
    }),
  );
}
