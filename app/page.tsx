import Link from "next/link";
import { Building2, ClipboardCheck, GraduationCap, Users } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "จัดการข้อมูลครบถ้วน",
    description: "ดูแลข้อมูลนักศึกษา อาจารย์นิเทศ โรงเรียน และภาคการศึกษาในที่เดียว",
  },
  {
    icon: Building2,
    title: "จัดสรรสถานที่ฝึกสอน",
    description: "เชื่อมโยงนักศึกษา โรงเรียน และอาจารย์นิเทศอย่างเป็นระบบ",
  },
  {
    icon: ClipboardCheck,
    title: "ติดตามและประเมินผล",
    description: "บันทึกการนิเทศและผลประเมิน พร้อมติดตามความคืบหน้าได้ง่าย",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <span>ระบบฝึกประสบการณ์วิชาชีพครู</span>
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-amber-300 hover:text-amber-300"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
        <div>
          <p className="mb-5 text-sm font-semibold tracking-wide text-amber-300">
            TEACHER INTERNSHIP MANAGEMENT
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            เชื่อมทุกขั้นตอนของการฝึกสอนให้เป็นระบบเดียว
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            บริหารการจัดสรรโรงเรียน การนิเทศ และการประเมินผลสำหรับนักศึกษา
            อาจารย์ และสถานศึกษา ด้วยข้อมูลที่ตรวจสอบได้และปลอดภัย
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/auth/login"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              เริ่มใช้งานระบบ
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              ดูความสามารถ
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-amber-950/30 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">ภาพรวมภาคการศึกษา</p>
              <p className="mt-1 text-2xl font-semibold">สถานะการฝึกสอน</p>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
              กำลังดำเนินการ
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["นักศึกษา", "128 คน"],
              ["โรงเรียน", "42 แห่ง"],
              ["อาจารย์นิเทศ", "24 คน"],
              ["นิเทศแล้ว", "76%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-slate-500">ข้อมูลตัวอย่างสำหรับหน้าเริ่มต้น</p>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <Icon className="size-7 text-amber-300" aria-hidden="true" />
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        ระบบบริหารการฝึกประสบการณ์วิชาชีพครู
      </footer>
    </main>
  );
}
