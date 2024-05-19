import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CircleAlertIcon } from "lucide-react";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300", "800"],
});

export const metadata: Metadata = {
  title: "Codesnaps",
  description:
    "Capture and run code snippets from images or handwritten notes, delivering instant results in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fira.className}>
        {children}
        <div className="     "></div>
        <Toaster
          icons={{
            error: <CircleAlertIcon />,
          }}
          toastOptions={{
            classNames: {
              toast:
                " p-4  border border-white rounded-[10px] shadow-sm shadow-black",
              title: " text-base font-semibold pl-2",
              description: " opacity-80 text-sm pl-2 text-xs tracking-tight",
            },
          }}
        />
      </body>
    </html>
  );
}
