export function debouncer(ms: number, fullSaveMs: number = ms) {
  let timeoutId: number | undefined;
  let lastFullSave = Date.now();

  return function (callback: TimerHandler) {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    const currentTime = Date.now();
    if (currentTime - lastFullSave >= fullSaveMs) {
      setTimeout(callback, 0);
      lastFullSave = currentTime;
    } else {
      timeoutId = setTimeout(callback, ms);
    }
  };
}
