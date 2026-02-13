import { Inter } from "next/font/google";
import "./globals.css";

// Apple-style के लिए Inter या SF Pro जैसा फॉन्ट सबसे बेस्ट है
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aura Analyze",
  description: "Premium Terminal",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#000000] text-white antialiased`}>
        {/* Apple-style Gradient Background (कांच जैसा फील देने के लिए) */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        </div>

        {/* Main Content Area */}
        <main className="min-h-screen max-w-md mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
