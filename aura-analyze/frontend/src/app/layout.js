import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrackWinGo",
  description: "Premium Terminal",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ❌ Yahan se bg-[#000000] hata diya hai */}
      <body className={`${inter.className} antialiased transition-colors duration-500`}>
        
        {/* Background Gradients (Theme based dikhenge) */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]" />
        </div>

        <main className="min-h-screen max-w-md mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
