"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Code, Trophy } from "lucide-react";
import { googlelogin } from "../../utils/Login";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const handleGoogleSignIn = async () => {
  try {
    console.log("Signing in with Google...");
    const res = await googlelogin(); // waits for login
    if(res) window.location.href = "/dashboard"; // redirect on success
    else{ 
      toast.error("Google Login Failed")
    }
  } catch (error) {
    console.error("Google Sign-In failed:", error);
    // show a toast or error message here
  }
};


  return (
    <div className="min-h-screen bg-[#36404A] relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#6D8196] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#ADCCED] rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6D8196] rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Landing Page */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="glass-card p-12 rounded-2xl mb-8">
            <div className="w-80 h-20 bg-gradient-to-br from-[#6D8196] to-[#ADCCED] rounded-2xl flex items-center justify-center mx-auto mb-6 ">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-[#d4dfeb] underline">codePing</span>
            </h1>
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stay On Track with Your{" "}
              <span className="text-[#ADCCED]">Coding Goals!</span>
            </h1>
            <p className="text-xl text-[#bbcfe2] mb-8 max-w-2xl mx-auto leading-relaxed">
              Never miss LeetCode POTDs or Contests again. Get personalized
              notifications to keep your coding journey consistent and
              successful.
            </p>

            <Button
              onClick={() => setShowModal(true)}
              className="text-[#ADCCED] glass-button-primary px-12 py-4 text-lg font-medium rounded-2xl"
            >
              Get Started
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#6D8196]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-[#ADCCED]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Daily Problems</h3>
              <p className="text-[#bbcfe2] text-sm">
                Never miss your daily coding practice
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#ADCCED]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-[#ADCCED]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Contest Alerts</h3>
              <p className="text-[#bbcfe2] text-sm">
                Stay updated on upcoming contests
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#bbcfe2]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-[#ADCCED]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Smart Reminders</h3>
              <p className="text-[#bbcfe2] text-sm">
                Personalized Daily Challenge Reminders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-modal max-w-md w-full rounded-2xl p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full glass-button text-white"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6D8196] to-[#ADCCED] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to codePing
              </h2>
              <p className="text-[#bbcfe2] text-sm">
                Sign in to start managing your coding notifications
              </p>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              className="w-full glass-button-google py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-[#bbcfe2] text-xs mt-6">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
