"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import ScrollToTop from "@/components/ScrollToTop";
import "node_modules/react-modal-video/css/modal-video.css";
import { ReactNode } from "react";
import "../styles/index.css";
import Head from "./head";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en">
      <Head />

      <body className="dark:bg-black">
        <Providers>
          <Header />
          {children}
          <Footer />
          {/* <ScrollToTop /> */}
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
