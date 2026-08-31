import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Activity, ArrowUpRight, Building2, ClipboardCheck, GraduationCap, InfoIcon, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getUserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", data.claims.sub).maybeSingle();
  return { name: profile?.full_name || data.claims.email?.split("@")[0] || "ผู้ใช้งาน", role: profile?.role || "student" };
}

const overview = [
  { label: "นักศึกษาฝึกสอน", value: "128", unit: "คน", icon: GraduationCap },
  { label: "โรงเรียนเครือข่าย", value: "42", unit: "แห่ง", icon: Building2 },
  { label: "อาจารย์นิเทศ", value: "24", unit: "คน", icon: Users },
  { label: "ความคืบหน้าการนิเทศ", value: "76", unit: "%", icon: Activity },
];
const quickActions = [
  { title: "จัดการนักศึกษา", description: "ดูข้อมูลและสถานะการฝึกสอน", icon: GraduationCap },
  { title: "จัดการโรงเรียน", description: "ดูโรงเรียนเครือข่ายและสมาชิก", icon: Building2 },
  { title: "การนิเทศและประเมินผล", description: "ติดตามการนิเทศและผลประเมิน", icon: ClipboardCheck },
];

async function Dashboard() {
  const user = await getUserDetails();
  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold tracking-wide text-amber-700">TEACHER INTERNSHIP MANAGEMENT</p><h1 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">แดชบอร์ดผู้ดูแลระบบ</h1><p className="mt-2 text-slate-600">ภาพรวมการฝึกประสบการณ์วิชาชีพครู ภาคการศึกษาปัจจุบัน</p></div>
        <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm shadow-sm"><p className="text-slate-500">สวัสดีครับ</p><p className="font-semibold text-blue-900">{user.name}</p></div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><InfoIcon className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden="true" /><div><p className="font-semibold">ยินดีต้อนรับสู่ระบบบริหารการฝึกสอน</p><p className="mt-1 text-sm text-amber-900/80">บัญชีของคุณมีสิทธิ์ {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งานทั่วไป"} และสามารถเริ่มจัดการข้อมูลได้</p></div></div>
      <section aria-labelledby="overview-heading"><div className="mb-4 flex items-center justify-between"><h2 id="overview-heading" className="text-xl font-bold text-blue-950">ภาพรวมระบบ</h2><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">ข้อมูลตัวอย่าง</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{overview.map(({ label, value, unit, icon: Icon }) => <article key={label} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-900/5"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><Icon className="size-5 text-blue-600" aria-hidden="true" /></div><p className="mt-4 text-3xl font-bold text-blue-950">{value}<span className="ml-1 text-base font-medium text-slate-500">{unit}</span></p></article>)}</div></section>
      <section aria-labelledby="quick-actions-heading"><h2 id="quick-actions-heading" className="mb-4 text-xl font-bold text-blue-950">เมนูการจัดการ</h2><div className="grid gap-4 md:grid-cols-3">{quickActions.map(({ title, description, icon: Icon }) => <Link key={title} href="/protected" className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"><div className="flex items-start justify-between"><Icon className="size-7 text-amber-600" aria-hidden="true" /><ArrowUpRight className="size-5 text-slate-300 transition group-hover:text-amber-600" aria-hidden="true" /></div><h3 className="mt-5 font-semibold text-blue-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></Link>)}</div></section>
    </div>
  );
}

export default function ProtectedPage() {
  return <Suspense fallback={<div className="py-16 text-center text-blue-900">กำลังโหลดแดชบอร์ด...</div>}><Dashboard /></Suspense>;
}
