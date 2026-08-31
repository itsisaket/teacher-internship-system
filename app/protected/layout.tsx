import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { GraduationCap } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <div className="flex min-h-screen w-full flex-col items-center">
        <nav className="w-full border-b border-blue-100 bg-white/95">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 text-sm">
            <Link href="/" className="flex items-center gap-3 font-semibold text-blue-950">
              <span className="flex size-9 items-center justify-center rounded-lg bg-blue-700 text-white"><GraduationCap className="size-5" aria-hidden="true" /></span>
              ระบบฝึกประสบการณ์วิชาชีพครู
            </Link>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
          {children}
        </div>

        <footer className="w-full border-t border-blue-100 bg-white px-6 py-8 text-center text-xs text-slate-500">
          <p>ระบบบริหารการฝึกประสบการณ์วิชาชีพครู · เชื่อมต่อด้วย Supabase</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
