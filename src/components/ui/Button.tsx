import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  href?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "default",
  href,
  fullWidth = false,
  onClick,
  className = "",
}) => {
  const baseClasses = "btn";
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size === "large" ? "btn-large" : "";
  const widthClasses = fullWidth ? "btn-full" : "";

  const allClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={allClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={allClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
