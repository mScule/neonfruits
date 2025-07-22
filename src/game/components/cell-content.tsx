import clsx from "clsx";
import type { GameContent } from "..";
import {
  LuApple as AppleIcon,
  LuBanana as BananaIcon,
  LuCherry as CherryIcon,
} from "react-icons/lu";
import { PiOrange as OrangeIcon } from "react-icons/pi";

type Props = {
  type: GameContent;
  variant?: "default" | "highlighted";
};

function Icon({ type, className }: { type: GameContent; className?: string }) {
  switch (type) {
    case "apple":
      return <AppleIcon className={className} />;
    case "banana":
      return <BananaIcon className={className} />;
    case "cherry":
      return <CherryIcon className={className} />;
    case "orange":
      return <OrangeIcon className={className} />;
  }
}

const colors: Record<
  GameContent,
  { textColor: string; borderColor: string; shadowColor: string }
> = {
  apple: {
    textColor: "text-green-300",
    borderColor: "border-green-300",
    shadowColor: "drop-shadow-green-500",
  },
  banana: {
    textColor: "text-yellow-300",
    borderColor: "border-yellow-300",
    shadowColor: "drop-shadow-yellow-500",
  },
  cherry: {
    textColor: "text-red-300",
    borderColor: "border-red-300",
    shadowColor: "drop-shadow-red-500",
  },
  orange: {
    textColor: "text-orange-300",
    borderColor: "border-orange-300",
    shadowColor: "drop-shadow-orange-500",
  },
};

export default function CellContent({ type, variant }: Props) {
  const { textColor, borderColor, shadowColor } = colors[type];

  return (
    <div
      className={clsx(
        "w-10 h-10 rounded-2xl font-bold text-center text-2xl flex flex-row justify-center items-center drop-shadow-md cursor-pointer",
        shadowColor,
        variant === "highlighted" && `border-2 ${borderColor}`
      )}
    >
      <Icon type={type} className={textColor} />
    </div>
  );
}
