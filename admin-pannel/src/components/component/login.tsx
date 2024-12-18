"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username,
      password,
    });
    console.log(res, "this is the ressssssss");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                prefetch={false}
              >
                <span className="flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-lg">
                  <div className="transition-all group-hover:scale-110  w-fit h-fit" />
                  Levant Admin
                </span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>
          <form className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
                <></>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="mt-1"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <></>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleSignIn}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
