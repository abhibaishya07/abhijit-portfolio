import { DM_Mono, Syne } from "next/font/google";
import "./globals.css";
import ClientShell from "@/app/components/ui/ClientShell";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono"
});

export const metadata = {
  title: "Abhijit Kr. Baishya | Full Stack & AI Engineer",
  description:
    "Cinematic 3D portfolio of Abhijit Kr. Baishya, B.Tech IT at GUIST, GATE CS 2026 qualified."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmMono.variable}`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
