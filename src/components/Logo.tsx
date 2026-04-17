"use client";

import { useTheme } from "@/context/ThemeContext";
import { withBase } from "@/lib/utils";

export default function Logo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  const { theme, mounted } = useTheme();
  const src = mounted
    ? theme === "dark"
      ? "/Logos/logo-dark.webp"
      : "/Logos/logo-light.webp"
    : "/Logos/logo-dark.webp";
  return (
    <img
      src={withBase(src)}
      alt="تک شاپ"
      height={size}
      style={{ height: size, width: "auto" }}
      className={className}
      loading="eager"
    />
  );
}
