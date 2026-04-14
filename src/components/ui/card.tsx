interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[var(--radius-lg)] border border-gray-100 shadow-soft p-8 ${className}`}
    >
      {children}
    </div>
  );
}
