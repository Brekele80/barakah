import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/app/components/header";

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-4">

              <Header />

              {children}

            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
