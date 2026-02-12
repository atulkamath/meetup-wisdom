import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meetup Wisdom Board",
  description: "Share your wisdom and advice with the community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
