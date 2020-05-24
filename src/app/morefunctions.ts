//random integer between min-max, inclusive
export function rngInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function distance(
  a: {x: number; y: number},
  b: {x: number; y: number}
): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
