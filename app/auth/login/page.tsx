import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
          ← กลับหน้าแรก
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
