/**
 * throttle limits the number of times a function can be called to a
 * given threshhold (100ms by default). The function is always called
 * on the leading and trailing edge.
 */

// @flow
export default function throttle(
  fn: (...args: any[]) => void,
  threshhold: number = 100
): {
  (...args: any[]): void;
  clearTimeout(): void;
} {
  let last: number | void;
  let deferTimer: any;
  const throttled: any = (...args: any[]) => {
    const now = Date.now();
    if (last !== undefined && now - last < threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn(...args);
      }, threshhold - (now - last));
    } else {
      last = now;
      fn(...args);
    }
  };

  throttled.clearTimeout = () => {
    if (deferTimer) {
      clearTimeout(deferTimer);
    }
  };

  return throttled;
}
