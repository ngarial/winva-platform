type BadgeVariant = "default" | "terracotta" | "midnight" | "success" | "warning" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-600",
  terracotta: "bg-terracotta/10 text-terracotta",
  midnight: "bg-midnight/10 text-midnight",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  outline: "bg-transparent border border-gray-200 text-text-soft",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
