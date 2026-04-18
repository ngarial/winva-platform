interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg className="w-8 h-8 text-terracotta" viewBox="0 0 48 50" fill="currentColor">
        <path d="M4 8 L18 0 L18 20 L32 10 L32 30 L18 40 L18 20 L4 28 Z" opacity="0.5"/>
        <path d="M16 20 L30 12 L30 32 L44 22 L44 42 L30 50 L30 32 L16 40 Z"/>
      </svg>
      <span className="font-body font-bold text-xl text-midnight tracking-wide">
        WINVA
      </span>
    </div>
  );
}
