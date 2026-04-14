interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 bg-midnight rounded-[var(--radius-sm)] flex items-center justify-center">
        <span className="text-terracotta font-display font-bold text-lg">W</span>
      </div>
      <span className="font-display font-semibold text-xl text-midnight tracking-tight">
        WINVA
      </span>
    </div>
  );
}
