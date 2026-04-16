"use client";

import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, KeyRound, CheckCircle, Crown, Eye, EyeOff } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

const MASTER_PIN = "Masteradmin@monu";

export default function MasterAdminPage() {
  const { adminLoggedIn, adminType, adminUser, setAdminLoggedIn, setAdminType, setAdminUser, adminLogout } = useAppStore();
  const [step, setStep] = useState<"pin" | "google">("pin");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (adminLoggedIn && adminType === "master") {
      setShowWelcome(true);
    }
  }, [adminLoggedIn, adminType]);

  if (adminLoggedIn && adminType === "master") {
    return (
      <div style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 30%, #1a0a2e 60%, #0a0a1a 100%)", minHeight: "100vh" }}>
        <div className="aqerionx-bar" />
        {showWelcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
            <div className="aqerionx-card aqerionx-glow rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-sm sm:max-w-md w-full mx-auto text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full blur-3xl aqerionx-blob" style={{ background: "rgba(0,229,255,0.15)" }} />
              <div className="absolute bottom-0 left-0 w-28 sm:w-40 h-28 sm:h-40 rounded-full blur-3xl aqerionx-blob" style={{ background: "rgba(124,58,255,0.15)", animationDelay: "2s" }} />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center aqerionx-border-shimmer" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,255,0.2))", border: "2px solid rgba(0,229,255,0.3)" }}>
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 aqerionx-text" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold aqerionx-text mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Welcome Master Admin
                </h1>
                <div className="text-lg sm:text-xl font-bold text-white mb-2">Monu</div>
                <p className="text-gray-400 text-sm mb-4 sm:mb-6">Full system access granted. You control everything.</p>
                <Button onClick={() => setShowWelcome(false)} className="w-full h-11 sm:h-12 text-base font-bold text-white cursor-pointer" style={{ background: "linear-gradient(135deg, #00e5ff, #7c3aff)" }}>
                  Enter Control Panel
                </Button>
              </div>
            </div>
          </div>
        )}
        <AdminDashboard />
      </div>
    );
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pin === MASTER_PIN) {
      setPinVerified(true);
      setStep("google");
    } else {
      setError("Invalid Master Admin PIN. Access denied.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setAdminUser({ email: user.email || "", displayName: user.displayName, photoURL: user.photoURL, uid: user.uid });
      setAdminType("master");
      setAdminLoggedIn(true);
      setShowWelcome(true);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user" || firebaseError.code === "auth/cancelled-popup-request") {
        setError("Sign-in was cancelled. Please try again.");
      } else {
        setError("Google verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 30%, #1a0a2e 60%, #0a0a1a 100%)" }}>
      <div className="aqerionx-bar" />
      <div className="absolute top-20 right-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl aqerionx-blob" style={{ background: "rgba(0,229,255,0.08)" }} />
      <div className="absolute bottom-20 left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl aqerionx-blob" style={{ background: "rgba(124,58,255,0.08)", animationDelay: "2s" }} />

      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl border-0 aqerionx-card aqerionx-glow relative">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,255,0.2))", border: "1px solid rgba(0,229,255,0.2)" }}>
            <Crown className="w-6 h-6 sm:w-7 sm:h-7 aqerionx-text" />
          </div>
          <CardTitle className="text-xl sm:text-2xl aqerionx-text" style={{ fontFamily: "'Syne', sans-serif" }}>Master Admin</CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            {step === "pin" ? "Enter your Master Admin PIN" : "Verify with Google to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg p-3 text-sm text-red-400 text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>
          )}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium ${step === "pin" ? "text-cyan-400" : "text-green-400"}`} style={{ background: step === "pin" ? "rgba(0,229,255,0.1)" : "rgba(16,185,129,0.1)", border: step === "pin" ? "1px solid rgba(0,229,255,0.2)" : "1px solid rgba(16,185,129,0.2)" }}>
              {pinVerified ? <CheckCircle className="w-3 h-3" /> : <KeyRound className="w-3 h-3" />}
              <span className="hidden sm:inline">Step 1:</span> PIN
            </div>
            <div className={`w-6 sm:w-8 h-0.5 ${pinVerified ? "bg-green-400/30" : "bg-gray-700"}`} />
            <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium ${step === "google" ? "text-cyan-400" : "text-gray-600"}`} style={{ background: step === "google" ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.03)", border: step === "google" ? "1px solid rgba(0,229,255,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="hidden sm:inline">Step 2:</span> Google
            </div>
          </div>

          {step === "pin" && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="text-center">
                  <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-400">Enter the Master Admin PIN</p>
                </div>
                <div className="relative">
                  <Input type={showPin ? "text" : "password"} placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="bg-white/5 backdrop-blur-md text-center text-base sm:text-lg tracking-widest h-12 text-white border-gray-700 focus:border-cyan-400" style={{ borderColor: "rgba(0,229,255,0.2)" }} autoFocus />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-semibold cursor-pointer text-white" style={{ background: "linear-gradient(135deg, #00e5ff, #7c3aff)" }}>Verify PIN</Button>
            </form>
          )}

          {step === "google" && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-400">PIN verified! Now verify with Google.</p>
              </div>
              <Button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 hover:border-cyan-300 h-11 sm:h-12 text-base font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: "#00e5ff" }} />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Verify with Google
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full text-gray-500 text-xs cursor-pointer hover:text-cyan-400" onClick={() => { setStep("pin"); setPinVerified(false); setPin(""); }}>Go back to PIN step</Button>
            </div>
          )}

          <div className="border-t pt-3" style={{ borderColor: "rgba(0,229,255,0.1)" }}>
            <a href="/">
              <Button variant="ghost" className="w-full text-gray-500 cursor-pointer hover:text-cyan-400"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Website</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
