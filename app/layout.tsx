import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShrtener — Forkort og del lenker enkelt",
  description:
    "Landingssiden for LinkShrtener. Forkort lenker, få klikkanalyse og administrer delte URL-er i et moderne dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="relative flex items-center px-6 py-0 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-tight">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">LinkShrtener</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Forkorte og dele lenker enkelt</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost">Logg inn</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-[#6c47ff] hover:bg-[#5535e0] rounded-full">
                    Registrer deg
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
