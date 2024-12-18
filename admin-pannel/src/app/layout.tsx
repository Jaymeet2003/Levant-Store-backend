"use client";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Head from "next/head";
import { DotFilledIcon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Levant Admin Panel</title>
        <meta
          name="description"
          content="Centralized admin panel for all Levant store projects"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add other meta tags as needed */}
      </Head>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <Providers>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                  <TooltipProvider>
                    <Link
                      href="/"
                      className="group flex h-13 w-13 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-lg font-semibold text-secondary md:h-14 md:w-14 md:text-base hover:bg-muted hover:text-primary transition-all animate-duration-[2000ms]"
                      prefetch={false}
                    >
                      <div>LSA</div>
                    </Link>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href="/upload-menu"
                          prefetch={false}
                          className="flex flex-col md:h-14 md:w-14 justify-center items-center transition-colors hover:bg-primary bg-secondary rounded-lg text-primary hover:text-secondary text-sm p-2"
                        >
                          <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg md:h-8 md:w-8">
                            <UploadIcon />
                          </div>
                          Menu
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Update menu</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href="/blog"
                          prefetch={false}
                          className="flex flex-col md:h-14 md:w-14 justify-center items-center transition-colors hover:bg-primary bg-secondary rounded-lg text-primary hover:text-secondary text-sm p-2"
                        >
                          <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg md:h-8 md:w-8">
                            <FileTextIcon />
                          </div>
                          Blog
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Blog</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href="#"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          prefetch={false}
                        >
                          <div className="h-5 w-5" />
                          <span className="sr-only">Settings</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </nav>
              </aside>
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-20">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <span>Levant Store</span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        <DotFilledIcon />
                        Levant Store
                      </DropdownMenuItem>
                      <DropdownMenuItem>Other stores</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="ml-auto flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem
                          onClickCapture={() =>
                            signOut({
                              redirect: true,
                            })
                          }
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </header>
              </div>
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-20">
                <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
