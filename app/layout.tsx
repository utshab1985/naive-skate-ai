import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/commerce";
import { SITE_NAME } from "lib/constants";
import { baseUrl } from "lib/utils";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import ChatWidget from '../components/chat-widget';
import "./globals.css";

const tsukimiRounded = localFont({
  src: [
    {
      path: "../fonts/TsukimiRounded-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/TsukimiRounded-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/TsukimiRounded-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/TsukimiRounded-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/TsukimiRounded-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tsukimi-rounded",
  adjustFontFallback: false,
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={tsukimiRounded.variable}>
      <body className={`${tsukimiRounded.className} bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white`}>
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
