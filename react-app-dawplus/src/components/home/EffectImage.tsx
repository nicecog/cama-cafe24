import { useState } from "react";
import camaImg1 from "@/assets/images/cama_img_1.png";
import { haptic } from "@/utils/haptic";

export default function EffectImage() {
  // Easter egg: bounce animation
  const [isBouncing, setIsBouncing] = useState(false);

  const handleImageClick = async () => {
    setIsBouncing(true);

    // Haptic feedback
    haptic.custom([10, 30, 15, 30, 10]);

    setTimeout(() => setIsBouncing(false), 800);
  };

  return (
    <img
      src={camaImg1}
      className={`w-24 cursor-pointer select-none transition-transform ${
        isBouncing ? "animate-bounce-scale" : ""
      }`}
      alt="cama character"
      onClick={handleImageClick}
      draggable={false}
    />
  );
}
