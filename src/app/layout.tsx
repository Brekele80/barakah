import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./theme-toggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-4">
              <header className="flex justify-between items-center mb-6">
                <Link href="/" className="text-2xl font-bold">
                  Barakah
                </Link>

                <ThemeToggle />
              </header>

              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
