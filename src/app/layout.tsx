import {ReactNode} from "react";
import type {Metadata} from "next";
import {Session} from "next-auth";

import Provider from "@/app/provider";
import {fontFamily} from "@/app/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: "Narrative Generator",
  description: "Generate narratives from video transcripts",
};

interface RootLayoutParams {
  session: Session | null;
}

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<RootLayoutParams>;
}

export default async function RootLayout({children, params}: Readonly<RootLayoutProps>) {
  const {session} = await params;

  console.log('Render RootLayout', {session})

  return (
      <html lang="en" className={fontFamily.variable}>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
      </html>
  );
}
