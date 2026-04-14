import { Logo } from "./logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight-soft to-midnight-elev" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo className="[&_div]:bg-terracotta [&_span:last-child]:text-white" />
          <div className="space-y-6">
            <h2 className="font-display text-4xl text-white leading-tight">
              Capital privé pour <br />
              <em className="text-terracotta">l&apos;Afrique qui entreprend</em>
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Accédez à des opportunités d&apos;investissement exclusives
              dans les PME africaines les plus prometteuses.
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} WINVA — Une marque DARHAN
          </p>
        </div>
        {/* Decorative glow */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl" />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-ivory">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-midnight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-text-soft">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
