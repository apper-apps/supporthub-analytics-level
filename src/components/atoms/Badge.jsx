import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
// ChatAnalysisStatus specific variants
    positive: "bg-green-100 text-green-800 border-green-200",
    neutral: "bg-blue-100 text-blue-800 border-blue-200",
    struggle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    critical: "bg-red-100 text-red-800 border-red-200",
    help: "bg-orange-100 text-orange-800 border-orange-200",
    technical: "bg-purple-100 text-purple-800 border-purple-200",
    special: "bg-gray-100 text-gray-800 border-gray-200",
    // Status-specific color variants
    troubleshooting: "bg-indigo-100 text-indigo-800 border-indigo-200",
    stuck: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confused: "bg-yellow-100 text-yellow-800 border-yellow-200",
    frustrated: "bg-orange-100 text-orange-800 border-orange-200",
    abandonment: "bg-red-100 text-red-800 border-red-200",
    debugging: "bg-indigo-100 text-indigo-800 border-indigo-200",
    performance: "bg-indigo-100 text-indigo-800 border-indigo-200",
    integration: "bg-indigo-100 text-indigo-800 border-indigo-200",
    repeating: "bg-orange-100 text-orange-800 border-orange-200",
    circles: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <span
      ref={ref}
      className={cn(
"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;