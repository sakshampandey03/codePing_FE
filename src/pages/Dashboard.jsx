"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  Code,
  Trophy,
  Calendar,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

import { apiConnector } from "../../utils/apis.js";
import { googlelogout } from "../../utils/Login.jsx";

import { toast } from "react-toastify";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [userSettings, setUserSettings] = useState({
    leetcode: false,
    leetcode_username: "",
    codechef: false,
    codeforces: false,
  });
  const [tempSettings, setTempSettings] = useState(userSettings);
  const [showApplyButton, setShowApplyButton] = useState(false);

  const [loading, setLoading] = useState(true);

  const [verifiedUsername, setVerifiedUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(null); // null = untouched, true = valid, false = invalid

  useEffect(() => {
    const setPreferences = async () => {
      // first get the email using getUser
      const userResponse = await apiConnector("GET", "/get_user");
      if (!userResponse?.user?.email) {
        console.error("No email found or not logged in");
        setLoading(false);
        return <div> Unauthorized Access</div>;
      }

      const email = userResponse?.user?.email;
      setUser(userResponse.user);

      // get userPReferences using the email
      const prefRes = await apiConnector(
        "GET",
        "/get_data",
        null,
        {},
        { email }
      );
      const prefs = prefRes?.userDetails;
      const formattedSettings = {
        leetcode: prefs?.leetcode_username !== "",
        leetcode_username: prefs?.leetcode_username || "",
        codechef: prefs?.codechef || false,
        codeforces: prefs?.codeforces || false,
      };

      setUserSettings(formattedSettings);
      setTempSettings(formattedSettings);
      setLoading(false);
    };

    setPreferences();
  }, []);

  const handleVerifyUsername = async () => {
    const username = tempSettings.leetcode_username;
    if (!username) toast("username cannot be empty");
    try {
      const res = await apiConnector("post", "/verify_user", { username });
      if (res.success) {
        toast.success("Usernmae verified");
        setIsUsernameValid(true);
        setVerifiedUsername(username);
      } else {
        toast.error("invalid username");
        setIsUsernameValid(false);
      }
    } catch (error) {
      toast.error("Verification failed");
      console.log("error in username verification", error);
    }
  };

  const handleSettingChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
    setShowApplyButton(true);
  };

  const applyChanges = async () => {
    console.log(tempSettings); // log what you're actually applying

    const { leetcode_username, codechef, codeforces } = tempSettings;
    const email = user?.email

    if (
      tempSettings.leetcode &&
      tempSettings.leetcode_username !== verifiedUsername
    ) {
      toast.warning("Please verify your LeetCode username before applying");
      return;
    }

    await apiConnector("POST", "/update_data", {
      email,
      leetcode_username,
      codechef,
      codeforces,
    });

    setUserSettings(tempSettings); // update state after API call
    setShowApplyButton(false);
  };

  const resetChanges = () => {
    setTempSettings(userSettings);

    setShowApplyButton(false);
  };

  const handleLogout = () => {
    googlelogout();
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-[#36404A] relative overflow-hidden">
      {/* Enhanced Background blur elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#6D8196] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ADCCED] rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6D8196] rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6D8196] to-[#ADCCED] rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-[#bbcfe2] text-sm">
                  Manage your coding notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="glass-button px-4 py-2 rounded-xl flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button className="glass-button px-4 py-2 rounded-xl flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Contact Us</span>
              </Button>
              <Button
                onClick={handleLogout}
                className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-red-300 hover:text-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Settings Panel */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#ADCCED]/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#ADCCED]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Notification Settings
                    </h2>
                    <p className="text-[#bbcfe2] text-sm">
                      Configure your coding reminders
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* LeetCode Daily */}
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#6D8196]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#6D8196]/20 rounded-lg flex items-center justify-center">
                          <Code className="w-6 h-6 text-[#6D8196]" />
                        </div>
                        <div>
                          <Label
                            htmlFor="leetcode"
                            className="text-white font-semibold text-lg cursor-pointer"
                          >
                            LeetCode Daily Problem
                          </Label>
                          <p className="text-[#bbcfe2] text-sm mt-1">
                            Get reminded to solve daily coding problems
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        id="leetcode"
                        checked={tempSettings.leetcode}
                        onCheckedChange={(checked) =>
                          handleSettingChange("leetcode", checked)
                        }
                        className="w-5 h-5 border-2 border-[#6D8196] data-[state=checked]:bg-[#6D8196] data-[state=checked]:border-[#6D8196]"
                      />
                    </div>
                    {tempSettings.leetcode && (
                      <div className="ml-16 mt-4 space-y-2">
                        <Label
                          htmlFor="leetcode-username"
                          className="text-[#ADCCED] text-sm font-medium"
                        >
                          LeetCode Username
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="leetcode-username"
                            value={tempSettings.leetcode_username}
                            onChange={(e) => {
                              handleSettingChange(
                                "leetcode_username",
                                e.target.value
                              );
                              setIsUsernameValid(null); // reset verification if username changed
                            }}
                            className="glass-input rounded-lg px-4 py-3 w-full"
                            placeholder="Enter your LeetCode username"
                          />
                          <button
                            onClick={handleVerifyUsername}
                            className="bg-[#6D8196] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5b718a]"
                          >
                            Verify
                          </button>
                        </div>
                        {isUsernameValid === true && (
                          <p className="text-green-400 text-sm">
                            ✅ Username Verified
                          </p>
                        )}
                        {isUsernameValid === false && (
                          <p className="text-red-400 text-sm">
                            ❌ Invalid Username
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CodeChef Contests */}
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#ADCCED]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#ADCCED]/20 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-[#ADCCED]" />
                        </div>
                        <div>
                          <Label
                            htmlFor="codechef-contests"
                            className="text-white font-semibold text-lg cursor-pointer"
                          >
                            CodeChef Contests
                          </Label>
                          <p className="text-[#bbcfe2] text-sm mt-1">
                            Stay updated on CodeChef competitions
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        id="codechef-contests"
                        checked={tempSettings.codechef}
                        onCheckedChange={(checked) =>
                          handleSettingChange("codechef", checked)
                        }
                        className="w-5 h-5 border-2 border-[#ADCCED] data-[state=checked]:bg-[#ADCCED] data-[state=checked]:border-[#ADCCED]"
                      />
                    </div>
                  </div>

                  {/* Codeforces Contests */}
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#bbcfe2]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#bbcfe2]/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#bbcfe2]" />
                        </div>
                        <div>
                          <Label
                            htmlFor="codeforces-contests"
                            className="text-white font-semibold text-lg cursor-pointer"
                          >
                            Codeforces Contests
                          </Label>
                          <p className="text-[#bbcfe2] text-sm mt-1">
                            Never miss Codeforces contests
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        id="codeforces-contests"
                        checked={tempSettings.codeforces}
                        onCheckedChange={(checked) =>
                          handleSettingChange("codeforces", checked)
                        }
                        className="w-5 h-5 border-2 border-[#bbcfe2] data-[state=checked]:bg-[#bbcfe2] data-[state=checked]:border-[#bbcfe2]"
                      />
                    </div>
                  </div>
                </div>

                {showApplyButton && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                    <Button
                      onClick={applyChanges}
                      className="flex-1 glass-button-primary py-4 rounded-xl font-semibold text-lg"
                    >
                      Apply Changes
                    </Button>
                    <Button
                      onClick={resetChanges}
                      className="px-8 glass-button rounded-xl font-medium"
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats/Info Panel */}
            <div className="space-y-6 ">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {/* <User className="w-5 h-5 text-[#ADCCED]" /> */}
                  <div className="w-5 h-5">
                    <img
                      src={user.avatar || "https://placehold.co/600x400.png"}
                      alt="User Avatar"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {user?.name || "Guest"}
                  </h3>
                </div>
                <div className="space-y-3 ">
                  <div>
                    <p className="text-[#bbcfe2] text-sm">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-[#bbcfe2] text-sm">
                      Active Notifications
                    </p>
                    <p className="text-[#ADCCED] font-semibold">
                      {
                        [
                          tempSettings.leetcode,
                          tempSettings.codechef,
                          tempSettings.codeforces,
                        ].filter(Boolean).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
