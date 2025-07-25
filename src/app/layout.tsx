import type { Metadata } from "next";
import "./globals.css";
import "@/lib/debug-helpers"; // Add debug functions to window
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/firebase-auth-context";
import { AuthProvider as LocalAuthProvider } from "@/components/auth/auth-provider";
import { DocumentAccessProvider } from "@/contexts/document-access-context";
import { ThemeProvider } from "@/components/theme-provider";
import { BlockchainProvider } from "@/contexts/blockchain-context";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MediSync Hub",
  description:
    "Secure, real-time medical record synchronization and transfer platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <LocalAuthProvider>
              <DocumentAccessProvider>
                <BlockchainProvider>
                  <AppLayout>{children}</AppLayout>
                  <Toaster />
                </BlockchainProvider>
              </DocumentAccessProvider>
            </LocalAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
