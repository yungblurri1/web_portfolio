import { DM_Sans } from "next/font/google"
import "./globals.css"

import Navbar from "@/components/navbar";
import Background from "@/components/background"
import Footer from "@/components/footer"


const font = DM_Sans({
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>  
      <body className={font.className}>
        <Background />
        <Navbar />
        <main className="max-w-7xl mx-auto px-6">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
