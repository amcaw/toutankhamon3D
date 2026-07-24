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

  return Math.min(Math.round((screenLongEdge || 1280) * dpr), 1920);
}
