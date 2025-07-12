import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import {ConvexClientProvider} from "@/providers/convexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp",
  description: "WhatsApp Clone Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark' suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-[#e1e1dc] dark:bg-black`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <ClerkProvider>
            <ConvexClientProvider>
              {children}
              <Toaster />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
