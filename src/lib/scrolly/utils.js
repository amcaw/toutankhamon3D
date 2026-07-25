export function debounce(func, delay = 0) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export const isScrollPositionAtTarget = (targetScrollPosition, threshold = 1) => {
  const currentScrollPosition = window.pageYOffset;
  const difference = Math.abs(currentScrollPosition - targetScrollPosition);

  return difference < threshold;
};

export function displayMaxLongEdge() {
  const dpr = Math.min(
    typeof window === 'object' && window.devicePixelRatio
      ? window.devicePixelRatio
      : 1,
    2,
  );
  const screenLongEdge =
    typeof screen === 'object'
      ? Math.max(screen.width || 0, screen.height || 0)
      : 0;

  const cap = isMemoryConstrained() ? 640 : 1920;

  return Math.min(Math.round((screenLongEdge || 1280) * dpr), cap);
}

export function isMemoryConstrained() {
  if (typeof window !== 'object') return false;

  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  const smallScreen =
    typeof screen === 'object' &&
    Math.min(screen.width || Infinity, screen.height || Infinity) <= 820;
  const lowMemory =
    typeof navigator === 'object' &&
    typeof navigator.deviceMemory === 'number' &&
    navigator.deviceMemory <= 4;

  return lowMemory || (coarsePointer && smallScreen);
}

// Decoded frames are kept as ImageBitmaps, i.e. GPU textures at 4 bytes per
// pixel. A phone's renderer budget is a few hundred MB, so cap the cache and
// let the worker drop frames evenly rather than have the GPU discard them
// mid-scroll.
export function frameCacheBudgetBytes() {
  return (isMemoryConstrained() ? 140 : 600) * 1024 * 1024;
}
