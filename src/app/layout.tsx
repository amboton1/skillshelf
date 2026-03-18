import { StackProvider, StackTheme } from "@stackframe/stack";
import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import NavBar from "@/components/ui/nav-bar";
import { syncUser } from "@/lib/auth/sync-user";
import { stackClientApp } from "../stack/client";
import "./globals.css";

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
});

export const metadata: Metadata = {
  title: "SkillShelf",
  description: "Browse and share learning resources",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void syncUser();

  return (
    <html lang="en" className={ubuntuMono.variable}>
      <body style={{ fontFamily: "var(--font-ubuntu-mono), monospace" }}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <NavBar />
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
