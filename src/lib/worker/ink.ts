import * as inkLib from "@/lib/ink";
import { InkWorkerRequest, InkWorkerResponse } from "@/lib/worker/rpc";

Object.entries(inkLib).forEach(
  ([name, value]) => ((self as any)[name] = value)
);

function runCode(source: string) {
  new Function(source)();
}

function executionQueue() {
  let executionPromise: Promise<undefined> | undefined;

  return async (callback: () => void) => {
    if (executionPromise) await executionPromise;
    executionPromise = new Promise((resolve) => {
      setTimeout(() => {
        callback();
        resolve(undefined);
      }, 0);
    });
  };
}

const scheduleDrawing = executionQueue();

(self as any).show = (...shapes: Array<inkLib.Shape>) => {
  const svg = inkLib.toSVG(shapes);
  const response: InkWorkerResponse = {
    type: "renderResult",
    args: { svg },
  };

  scheduleDrawing(() => self.postMessage(response));
};

(self as any).draw = (self as any).show;

self.addEventListener("message", (event) => {
  try {
    const request = event.data as InkWorkerRequest;
    switch (request.type) {
      case "run":
        runCode(request.args.source);
        break;
    }
  } catch (e) {
    console.error("Worker Error:", e);
  }
});
