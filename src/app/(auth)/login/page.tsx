"use client";

import { signIn } from "next-auth/react";
import { GitPullRequest, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GitPullRequest className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to OSS Contributor
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in with your GitHub account to start contributing to open source
              with AI assistance.
            </p>

            {/* GitHub Login Button */}
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <GitPullRequest className="w-5 h-5 mr-2" />
              )}
              Continue with GitHub
            </Button>

            <p className="mt-6 text-sm text-gray-500">
              We&apos;ll request access to your public profile and repositories.
              <br />
              No private data is stored without your permission.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
