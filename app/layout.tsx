import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "KickZone Admin",
  description: "Admin Dashboard for KickZone Booking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Toaster position="top-right" />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
