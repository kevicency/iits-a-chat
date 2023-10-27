export const iitsLetters = [
  // i
  [6, 10],
  [6, 12],
  [6, 13],
  [6, 14],
  // i
  [8, 10],
  [8, 12],
  [8, 13],
  [8, 14],
  // t
  [10, 10],
  [10, 11],
  [10, 12],
  [10, 13],
  [10, 14],
  [11, 11],
  // s
  [12, 14],
  [13, 11],
  [13, 12],
  [13, 13],
  [13, 14],
  [14, 11],
]

const arr16 = new Array(16).fill(0).map((_, i) => i)
export const xys = arr16.flatMap((y) => arr16.map((x) => [x, y]))
export const iitsLogoMap = xys.reduce(
  (acc, [x, y]) => {
    acc[`${x},${y}`] = iitsLetters.some(([lx, ly]) => lx === x && ly === y)
    return acc
  },
  {} as Record<string, boolean>,
)
