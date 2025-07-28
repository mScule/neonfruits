import type { PayloadAction, Location } from "@/engine";
import noImplementation from "@/engine/empty";

// Key

export const FLIP_ANIMATION_ACTION = "FLIP_ANIMATION";

// Definition

export type FlipAnimationAction = PayloadAction<
  typeof FLIP_ANIMATION_ACTION,
  { from: Location; to: Location }
>;

// Implementation

export const flipAnimationAction = noImplementation;
