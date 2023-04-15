import * as inkLib from "@/lib/ink";
import { InkWorkerRequest, InkWorkerResponse } from "@/lib/worker/rpc";

Object.entries(inkLib).forEach(
  ([name, value]) => ((self as any)[name] = value)
);

function sendLog(type: "log" | "warn" | "error", message: string) {
  self.postMessage({
    type: "console",
    args: { type, msg: message },
  });
}

(self as any).sendLog = sendLog;
function buildScript(source: string) {
  return `
const console = {
  log: (...data) => sendLog("log", data.join(" ")),
  warn: (...data) => sendLog("warn", data.join(" ")),
  error: (...data) => sendLog("error", data.join(" "))
};

try {
${source}
} catch (e) {
  console.error("Execution error:", e);
}`;
}

function runCode(source: string) {
  markersEnabled = true;
  viewportWidth = 300;
  viewportHeight = 300;

  new Function(buildScript(source))();
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

let viewportWidth = 300;
let viewportHeight = 300;
let markersEnabled = true;

(self as any).enableMarkers = () => {
  markersEnabled = true;
};

(self as any).disableMarkers = () => {
  markersEnabled = false;
};

(self as any).setViewport = (width: number, height: number) => {
  viewportWidth = width;
  viewportHeight = height;
};

(self as any).show = (...shapes: Array<inkLib.Shape>) => {
  if (markersEnabled) {
    const stroke = "#ffffff66";

    shapes = [
      inkLib.rect(viewportWidth, viewportHeight, undefined, { stroke }),
      inkLib.line(
        inkLib.point(-viewportWidth / 2, 0),
        inkLib.point(viewportWidth / 2, 0),
        undefined,
        { stroke }
      ),
      inkLib.line(
        inkLib.point(0, -viewportHeight / 2),
        inkLib.point(0, viewportHeight / 2),
        undefined,
        { stroke }
      ),
      ...shapes,
    ];
  }

  const svg = inkLib.toSVG(shapes, viewportWidth, viewportHeight);
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
