import React from "react";

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  // DaisyUIの`btn`クラスとバリアントを使う
  const variantClass = `btn btn-${variant}`;

  return (
    <button
      className={`${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
