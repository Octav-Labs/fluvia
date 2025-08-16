import React from "react";

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
      {/* Icon - Flowing river lines forming abstract "F" */}
      <svg
        className={`${sizeClasses[size]} flex-shrink-0`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main flowing curve - vertical stroke of "F" */}
        <path
          d="M12 8C12 8 16 12 16 20C16 28 12 32 12 40"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top horizontal stroke of "F" */}
        <path
          d="M12 16C12 16 20 16 28 16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Middle horizontal stroke of "F" */}
        <path
          d="M12 28C12 28 18 28 24 28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Flowing accent lines */}
        <path
          d="M20 12C20 12 24 14 26 18"
          stroke="#00BFA6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        <path
          d="M24 24C24 24 28 26 30 30"
          stroke="#E6B17A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Text - only show if variant is "full" */}
      {variant === "full" && (
        <span className={`font-bold ${textSizes[size]} text-primary`}>
          Fluvia
        </span>
      )}
    </div>
  );
}
