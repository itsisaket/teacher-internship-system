import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "ระบบบริหารการฝึกประสบการณ์วิชาชีพครู",
    template: "%s | ระบบฝึกประสบการณ์วิชาชีพครู",
  },
  description:
    "ระบบจัดการนักศึกษา โรงเรียน การนิเทศ และการประเมินผลการฝึกประสบการณ์วิชาชีพครู",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
