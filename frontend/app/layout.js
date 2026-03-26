import "./globals.css";
import "leaflet/dist/leaflet.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Disaster",
  description: "ML based prediction system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
