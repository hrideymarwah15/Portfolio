import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import StickyHeader from "@/components/StickyHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hrideymarwah.com"),
  title: {
    default: "Hridey Marwah",
    template: "%s | Hridey Marwah",
  },
  description: "Software engineer building reliable systems and clear interfaces.",
  openGraph: {
    title: "Hridey Marwah",
    description: "Software engineer building reliable systems and clear interfaces.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://hrideymarwah.com",
    siteName: "Hridey Marwah",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Hridey Marwah",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap"
          rel="stylesheet"
        />
        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <ThemeProvider>
          <StickyHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
