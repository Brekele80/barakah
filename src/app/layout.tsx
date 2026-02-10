import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./theme-toggle";
import { Bookmark } from "lucide-react";

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

        {/* restore language on first load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try{
                  const lang = localStorage.getItem("lang");
                  if(!lang) return;
                  const url = new URL(window.location.href);
                  if(!url.searchParams.get("lang")){
                    url.searchParams.set("lang", lang);
                    window.location.replace(url.toString());
                  }
                }catch(e){}
              })();
            `,
          }}
        />
      </head>

      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="max-w-3xl mx-auto p-4">

              <header className="flex justify-between items-center mb-6">
                <Link href="/" className="text-2xl font-bold">
                  Barakah
                </Link>

                <div className="flex items-center gap-4">
                  <Link href="/bookmarks" className="text-xl">
                    <Bookmark className="w-6 h-6 fill-current" />
                  </Link>

                  <ThemeToggle />
                </div>
              </header>

              {children}

            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
