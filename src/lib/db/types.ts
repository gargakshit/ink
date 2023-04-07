import { type NextApiResponse } from "next";

export enum UpdateResult {
  Ok,
  Unauthorized,
  NotFound,
  Error,
}

export function sendUpdateResult(res: NextApiResponse, result: UpdateResult) {
  switch (result) {
    case UpdateResult.Ok:
      return res.status(200).send("Ok");

    case UpdateResult.Unauthorized:
      return res.status(401).send("Unauthorized");

    case UpdateResult.Error:
      return res.status(500).send("Internal server error");

    case UpdateResult.NotFound:
      return res.status(404).send("Not found");
  }
}
