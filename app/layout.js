import localFont from "next/font/local";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from "./providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "WeatherApp",
  description: "Get your local weather forecast instantly!",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>
          <Navigation />
          <main className="container mx-auto mt-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
