type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "bg-error/10 text-error border-error/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-midnight/5 text-midnight border-midnight/10",
};

export function Alert({ variant = "info", children, className = "" }: AlertProps) {
  return (
    <div
      className={`px-4 py-3 rounded-[var(--radius-md)] border text-sm ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
