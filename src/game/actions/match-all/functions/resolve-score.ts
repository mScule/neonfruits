import { type Content } from "@/engine";
import {
  APPLE_SCORE,
  BANANA_SCORE,
  CHERRY_SCORE,
  ORANGE_SCORE,
  type GameContent,
} from "@/game";

export default function resolveScore(content: Content<GameContent>): number {
  switch (content) {
    case "empty":
      return 0;
    case "apple":
      return APPLE_SCORE;
    case "orange":
      return ORANGE_SCORE;
    case "banana":
      return BANANA_SCORE;
    case "cherry":
      return CHERRY_SCORE;
  }
}
