"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthCard
      title="Reset your password"
      description="We'll help you get back into your account"
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Info className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            Self-serve password reset isn&rsquo;t available yet — we&rsquo;re building it. In the
            meantime, reach out to{" "}
            <a href="mailto:support@videoloom.example" className="underline hover:text-foreground">
              support@videoloom.example
            </a>{" "}
            for help regaining access to your account.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" className="mt-2 w-full" size="lg">
            Send reset instructions
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
