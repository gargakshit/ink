import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  createCollection,
  getMyCollections,
  putInCollection,
} from "@/lib/db/collections";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return await post(req, res);

    case "GET":
      return await get(req, res);

    case "PUT":
      return await put(req, res);
  }

  return res.status(405).send("Method not allowed");
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const id = req.body.id;
  const inkId = req.body.inkId;
  const selected = req.body.selected;

  if (id === undefined || inkId === undefined || selected === undefined) {
    return res.status(400).send("Bad Request");
  }

  await putInCollection(session, id, inkId, selected);
  return res.send("Ok");
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(await getMyCollections(session));
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const name = req.body.name;
  await createCollection(session, name);

  return res.status(201).send("Created");
}
