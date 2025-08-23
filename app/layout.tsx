import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canva Clone",
  description: "Create svg or png graphics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
