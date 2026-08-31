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
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <nav className="border-b border-sky-100 bg-white/90">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-900/20">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <span>ระบบฝึกประสบการณ์วิชาชีพครู</span>
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-800 transition hover:border-amber-500 hover:text-amber-700"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
        <div>
          <p className="mb-5 text-sm font-semibold tracking-wide text-amber-700">
            TEACHER INTERNSHIP MANAGEMENT
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-blue-950 sm:text-5xl lg:text-6xl">
            เชื่อมทุกขั้นตอนของการฝึกสอนให้เป็นระบบเดียว
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            บริหารการจัดสรรโรงเรียน การนิเทศ และการประเมินผลสำหรับนักศึกษา
            อาจารย์ และสถานศึกษา ด้วยข้อมูลที่ตรวจสอบได้และปลอดภัย
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/auth/login"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800"
            >
              เริ่มใช้งานระบบ
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-800 transition hover:border-amber-400 hover:text-amber-700"
            >
              ดูความสามารถ
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-2xl shadow-blue-900/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">ภาพรวมภาคการศึกษา</p>
              <p className="mt-1 text-2xl font-semibold text-blue-950">สถานะการฝึกสอน</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
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
              <div key={label} className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-semibold text-blue-900">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-slate-500">ข้อมูลตัวอย่างสำหรับหน้าเริ่มต้น</p>
        </div>
      </section>

      <section id="features" className="border-t border-blue-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-900/5 transition hover:-translate-y-1 hover:border-amber-300">
              <Icon className="size-7 text-amber-600" aria-hidden="true" />
              <h2 className="mt-5 text-lg font-semibold text-blue-950">{title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-sky-50 px-6 py-8 text-center text-sm text-slate-500">
        ระบบบริหารการฝึกประสบการณ์วิชาชีพครู
      </footer>
    </main>
  );
}
