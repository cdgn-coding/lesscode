import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AppQueryClientProvider from "@/config/tanstack";
import {Toaster} from "@/components/ui/sonner";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Lesscode",
    description: "Una plataforma para crear aplicaciones sin código",
};



export default function RootLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable,
            )}
        >
            <Toaster position={"top-center"} />
            <AppQueryClientProvider>
                <TooltipProvider>{children}</TooltipProvider>
            </AppQueryClientProvider>
        </body>
        </html>
    );
}
