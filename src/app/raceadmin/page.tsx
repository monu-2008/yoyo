"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Crown } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

// Allowed admin emails
const ALLOWED_ADMIN_EMAILS = [
  "racecomputer16000@gmail.com",
];

export default function AdminPage() {
  const { adminLoggedIn, adminType, setAdminLoggedIn, setAdminType, setAdminUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in as admin, show dashboard
  if (adminLoggedIn && (adminType === "admin" || adminType === "master")) {
    return <AdminDashboard />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email?.toLowerCase() || "";

      if (ALLOWED_ADMIN_EMAILS.includes(email)) {
        setAdminUser({
          email: user.email || "",
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        setAdminType("admin");
        setAdminLoggedIn(true);
      } else {
        setError("This Google account is not authorized as admin.");
        auth.signOut();
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user" || firebaseError.code === "auth/cancelled-popup-request") {
        setError("Sign-in was cancelled. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef0ff 50%, #f0f4ff 100%)" }}>
      <Card className="w-full max-w-md shadow-xl border border-gray-100 bg-white">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-50 border border-red-100">
            <Shield className="w-7 h-7 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <CardDescription className="text-gray-500">Sign in with your authorized Google account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg p-3 text-sm text-red-600 bg-red-50 border border-red-100 text-center">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-red-300 h-12 text-base font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-red-500" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-400">
              Only authorized Google accounts can access admin panel
            </p>
          </div>

          {/* Master Admin Access - CLEARLY VISIBLE */}
          <div className="border-t border-gray-100 pt-4">
            <a href="/racemaster" className="block">
              <Button
                variant="outline"
                className="w-full h-12 cursor-pointer text-sm font-semibold gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 bg-purple-50/50"
              >
                <Crown className="w-4 h-4 text-purple-600" />
                Master Admin Access
              </Button>
            </a>
            <a href="/" className="block mt-2">
              <Button variant="ghost" className="w-full text-gray-400 cursor-pointer hover:text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
