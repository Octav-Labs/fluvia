import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className = "",
  variant = "full",
  size = "md",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon - Using the new PNG logo image */}
      <Image
        src="/images/logowithoutbackground.png"
        alt="Fluvia Logo"
        width={48}
        height={48}
        className={`${sizeClasses[size]} flex-shrink-0 object-contain`}
      />

      {/* Text - only show if variant is "full" */}
      {variant === "full" && (
        <span className={`font-bold ${textSizes[size]} text-primary`}>
          Fluvia
        </span>
      )}
    </div>
  );
}
