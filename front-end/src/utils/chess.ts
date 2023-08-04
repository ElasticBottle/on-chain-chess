import { Square } from "chess.js";

export function convertChessPositionToTuple(position: Square) {
  const x = position[0];
  const y = position[1];
  return { x: Math.abs((x?.charCodeAt(0) ?? 0) - 97 - 7), y: Number(y) - 1 };
}
export function convertTupleToChessPosition(position: {
  x: number;
  y: number;
}) {
  const x = position.x;
  const y = position.y;
  const mapping = {
    0: 'h',
    1: 'g',
    2: 'f',
    3:'e',
    4:'d',
    5:'c',
    6:'b',
    7:'a'
  }
  return `${mapping[x]}${y + 1}`;
}
