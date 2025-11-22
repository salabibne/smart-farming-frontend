import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
 

export const metadata = {
  title: "Smart Farming App",
  description: "An application for smart farming solutions.",
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-[#E5F9DB] min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
