export type InkWorkerRequest = {
  type: "run";
  args: { source: string };
};

export type InkWorkerResponse =
  | {
      type: "renderResult";
      args: { svg: string };
    }
  | {
      type: "console";
      args: {
        type: "log" | "warn" | "error";
        msg: string;
      };
    };
