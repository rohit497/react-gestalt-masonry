import { Cache } from './Cache.js';

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

const mindex = (arr: number[]) => {
  let idx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[idx]) {
      idx = i;
    }
  }
  return idx;
};

export default <T>({
  gutter = 0,
  cache,
  minCols = 2,
  maxCols = Infinity,
  idealColumnWidth = 240,
  width,
}: {
  gutter?: number,
  cache: Cache<T, number>,
  minCols?: number,
  maxCols?: number,
  idealColumnWidth?: number,
  width?: number,
}) => {
  if (width == null) {
    return (items: any[]): Position[] =>
      items.map(() => ({
        top: Infinity,
        left: Infinity,
        width: Infinity,
        height: Infinity,
      }));
  }

  // "This is kind of crazy!" - you
  // Yes, indeed. The "guessing" here is meant to replicate the pass that the
  // original implementation takes with CSS.
  const colguess = Math.floor(width / idealColumnWidth);
  const columnCount = Math.min(Math.max(
    Math.floor((width - colguess * gutter) / idealColumnWidth),
    minCols
  ), maxCols);
  const columnWidth = Math.floor(width / columnCount);

  return (items: T[]) => {
    // the total height of each column
    const heights = new Array(columnCount).fill(0);

    return items.reduce((acc, item) => {
      const positions = acc;
      const height = cache.get(item);
      let position;

      if (height == null) {
        position = {
          top: Infinity,
          left: Infinity,
          width: columnWidth,
          height: Infinity,
        };
      } else {
        const col = mindex(heights);
        const top = heights[col];
        const left = col * columnWidth + gutter / 2;

        heights[col] += height;
        position = {
          top,
          left,
          width: columnWidth - gutter,
          height,
        };
      }

      positions.push(position);
      return positions;
    }, [] as Position[]);
  };
};
