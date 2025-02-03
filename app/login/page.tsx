"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github01Icon, GoogleIcon, Radar01Icon } from "hugeicons-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  const { data: session } = useSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2 absolute top-6 left-8">
            <Radar01Icon
              size={24}
              className="text-primary scale-x-[-1] -rotate-[225deg]"
            />
            <span className="uppercase font-semibold">Glicotrack</span>
          </div>

        {/* Form */}
        <h2 className="mt-4 text-2xl font-semibold">Bem vindo!</h2>
        <form className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
            />
          </div>

          <Button type="submit" className="w-full">
            Login com Magic Link
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span>Ou</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col space-y-2">
            <Button type="button" variant="outline" onClick={() => signIn("google", { callbackUrl: "/" })}>
              <GoogleIcon className="h-5 w-5 mr-2" />
              Continue com o Google
            </Button>
            <Button type="button" variant="outline" onClick={() => signIn("github", { callbackUrl: "/" })}>
              <Github01Icon className="h-5 w-5 mr-2" />
              Continue com o Github
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
