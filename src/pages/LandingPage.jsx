"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Code,
  Trophy,
  Share2,
  Calendar,
  BarChart2,
  Globe2,
} from "lucide-react";
import { googlelogin } from "../../utils/Login";
import { toast } from "react-toastify";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const res = await googlelogin();
      if (res) window.location.href = "/preferences";
      else toast.error("Google Login Failed");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  const features = [
    {
      icon: Code,
      title: "Daily Problems",
      desc: "Get personalized POTD reminders synced to your phone’s clock widget or Google-style “At a Glance,” keeping your streak active right on your home screen.",
    },
    {
      icon: Trophy,
      title: "Contest Alerts",
      desc: "Receive precise alerts for upcoming contests and challenges, ensuring you always compete on time and never miss opportunities to test and grow your coding skills.",
    },
    {
      icon: Share2,
      title: "One-Click Profile Sharing",
      desc: "Share all your coding profiles in a single click—streamline recruiter access to your achievements and technical expertise without navigating multiple platforms or pages.",
    },
    {
      icon: Calendar,
      title: "Streak Tracking",
      desc: "Visualize and maintain your coding streaks with detailed progress views, helping you celebrate milestones, stay motivated, and build consistent daily problem-solving habits.",
    },
    {
      icon: BarChart2,
      title: "Smart Analytics",
      desc: "Unlock in-depth insights on accuracy, performance, and improvement areas—advanced analytics designed to track growth, highlight strengths, and refine your coding strategies.",
    },
    {
      icon: Globe2,
      title: "Global Leaderboard",
      desc: "Compete against developers worldwide, monitor your ranking in real time, and climb the leaderboard to showcase your coding skills on a truly global platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#36404A] relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#6D8196] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#ADCCED] rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6D8196] rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center  mx-auto">
          <div className="glass-card p-12 rounded-2xl mb-8 max-w-4xl mx-auto mt-5">
            <div className="w-80 h-20 bg-gradient-to-br from-[#6D8196] to-[#ADCCED] rounded-2xl flex items-center justify-center mx-auto mb-6 ">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight ">
                <span className="text-[#d4dfeb] underline">codeP!ng</span>
              </h1>
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stay On Track with Your{" "}
              <span className="text-[#ADCCED]">Coding Goals!</span>
            </h1>
            <p className="text-xl text-[#bbcfe2] mb-8 max-w-2xl mx-auto leading-relaxed">
              CodePing keeps you consistent, competitive, and connected with
              powerful reminders, analytics, and sharing tools—all in one place.
            </p>

            <Button
  onClick={() => setShowModal(true)}
  className="relative px-12 py-4 text-xl font-semibold text-white rounded-2xl
             bg-gradient-to-br from-[#6D8196] to-[#ADCCED]
             shadow-lg shadow-black/30
             hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/40
             active:translate-y-[1px] active:shadow-md active:shadow-black/20
             transition-all duration-200 ease-in-out
             focus:outline-none focus:ring-4 focus:ring-[#ADCCED]/40"
>
  Get Started
</Button>

          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-4/5 mx-auto">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="w-12 h-12 bg-[#6D8196]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#ADCCED]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-[#bbcfe2] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-In Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-modal max-w-md w-full rounded-2xl p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-white"
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
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24"> <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /> <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /> <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /> <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /> </svg>
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
