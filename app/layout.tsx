import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "600", "700", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Buddha CEO",
  description:
    "Buddha CEO - Empowering leaders, professionals, and seekers with transformative meditation wisdom & techniques. Join our global community and discover inner peace, radiant health, and infinite possibilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${lora.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
