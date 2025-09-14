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
  Mail,
  LogOut,
  Home,
  LayoutDashboard,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ContactForm from "@/components/ui/contact-form.jsx";

import { apiConnector } from "../../utils/apis.js";
import { googlelogout } from "../../utils/Login.jsx";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_SECRET_KEY;

// Calendar subscription links
const CODECHEF_CAL =
  "https://calendar.google.com/calendar/u/0?cid=Y2ViNDlmZmE4NGExMmIzMDZkZGY4ZjcxMjljYTgzZWQwNDJmMDkwODJhMmNmN2FmZjYzMzM3OWIxZjA2NTcxY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t";
const CODEFORCES_CAL =
  "https://calendar.google.com/calendar/u/0?cid=Y2Y3NzA3ODMxNzMwMDgyZmJlOTQwODY5MjlhMzEwMDUzZGQyZmQ3ZmY3NGU4NDI1YzczZDFiNmJhZjg0MmQwNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t";
const LEETCODE_CAL =
  "https://calendar.google.com/calendar/u/0?cid=MzRlNGFkNjA1NjQ3YTJhNGY5YTA3ZWNiNWNlYmNhM2M0Y2JmYjVmYTc0ZjNmYmIxOTc2OTcwY2Y4NmJkNjIxM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t";

export default function Preferences() {
  const [user, setUser] = useState({});
  const [userSettings, setUserSettings] = useState({
    leetcode: false,
    leetcode_username: "",
    codechef: false,
    codeforces: false,
    leetcode_contests: false,
    // calendar subscriptions
    codechef_calendar: false,
    codeforces_calendar: false,
    leetcode_contests_calendar: false,
  });
  const [tempSettings, setTempSettings] = useState(userSettings);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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
        return;
      }

      const email = userResponse?.user?.email;
      setUser(userResponse.user);

      // get userPreferences using the email
      const prefRes = await apiConnector(
        "GET",
        "/get_data",
        null,
        {},
        { email }
      );
      const prefs = prefRes?.userDetails || {};

      const formattedSettings = {
        leetcode: prefs?.leetcode_username !== "",
        leetcode_username: prefs?.leetcode_username || "",
        codechef: prefs?.codechef || false,
        codeforces: prefs?.codeforces || false,
        leetcode_contests: prefs?.leetcode_contests || false,
        codechef_calendar: prefs?.codechef_calendar || false,
        codeforces_calendar: prefs?.codeforces_calendar || false,
        leetcode_contests_calendar: prefs?.leetcode_contests_calendar || false,
      };

      setUserSettings(formattedSettings);
      setTempSettings(formattedSettings);
      setLoading(false);
    };

    setPreferences();
  }, []);

  const handleVerifyUsername = async () => {
    const username = tempSettings.leetcode_username;
    if (!username) return toast("username cannot be empty");
    try {
      const res = await apiConnector("post", "/verify_user", { username });
      if (res.success) {
        toast.success("Username verified");
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
    console.log("Applying: ", tempSettings);

    const {
      leetcode_username,
      codechef,
      codeforces,
      leetcode_contests,
      codechef_calendar,
      codeforces_calendar,
      leetcode_contests_calendar,
    } = tempSettings;

    const email = user?.email;

    if (
      tempSettings.leetcode &&
      tempSettings.leetcode_username !== verifiedUsername
    ) {
      toast.warning("Please verify your LeetCode username before applying");
      return;
    }

    // send everything to backend; backend may ignore unknown fields if not present
    await apiConnector("POST", "/update_data", {
      email,
      leetcode_username,
      codechef,
      codeforces,
      leetcode_contests,
      codechef_calendar,
      codeforces_calendar,
      leetcode_contests_calendar,
    });

    setUserSettings(tempSettings); // update state after API call
    setShowApplyButton(false);
    toast.success("Preferences saved");
  };

  const resetChanges = () => {
    setTempSettings(userSettings);
    setShowApplyButton(false);
  };

  const handleLogout = () => {
    googlelogout();
  };
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    const email = user?.email || "";
    if (email) {
      const token = CryptoJS.AES.encrypt(email, secretKey).toString();
      navigate(`/dashboard?email=${encodeURIComponent(token)}`);
    } else console.log("no email found");
  };

  const [codechefShow, setCodechefShow] = useState(false);
  const [codeforcesShow, setCodeforcesShow] = useState(false);
  const [leetcodeShow, setLeetcodeShow] = useState(false);

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
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-[#bbcfe2] text-sm">
                  Manage your coding notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-white"
                onClick={handleGoToDashboard}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-white">
                <Link to={"/"}>
                  <Home className="w-4 h-4" />
                </Link>
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                onClick={() => setShowContactForm(true)}
                className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Contact</span>
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
                  {/* LeetCode Daily - note: no calendar subscription for potd */}
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
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#ADCCED] text-white">
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
                      <button
                        onClick={() => setCodechefShow(!codechefShow)}
                        className="flex items-center justify-between rounded-full ring-2 text-white px-4 py-2  hover:bg-gray-700 transition"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            codechefShow ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {codechefShow && (
                      <div className="mt-4 ml-16 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#bbcfe2]">
                              Subscribe to CodeChef calendar
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={CODECHEF_CAL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 "
                              onClick={() =>
                                handleSettingChange(
                                  "codechef_calendar",
                                  true
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">Subscribe</span>
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-[#bbcfe2]">
                            Receive email alerts for CodeChef contests
                          </p>
                          <Checkbox
                            id="codechef-mail"
                            checked={tempSettings.codechef}
                            onCheckedChange={(checked) =>
                              handleSettingChange("codechef", checked)
                            }
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Codeforces Contests */}
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#ADCCED] text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#ADCCED]/20 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-[#ADCCED]" />
                        </div>
                        <div>
                          <Label
                            htmlFor="codeforces-contests"
                            className="text-white font-semibold text-lg cursor-pointer"
                          >
                            codeforces Contests
                          </Label>
                          <p className="text-[#bbcfe2] text-sm mt-1">
                            Stay updated on codeforces competitions
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCodeforcesShow(!codeforcesShow)}
                        className="flex items-center justify-between rounded-full ring-2 text-white px-4 py-2  hover:bg-gray-700 transition"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            codeforcesShow ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {codeforcesShow && (
                      <div className="mt-4 ml-16 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#bbcfe2]">
                              Subscribe to codeforces calendar
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={CODEFORCES_CAL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 "
                              onClick={() =>
                                handleSettingChange(
                                  "codeforces_calendar",
                                  true
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">Subscribe</span>
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-[#bbcfe2]">
                            Receive email alerts for codeforces contests
                          </p>
                          <Checkbox
                            id="codeforces-mail"
                            checked={tempSettings.codeforces}
                            onCheckedChange={(checked) =>
                              handleSettingChange("codeforces", checked)
                            }
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* leetcode contests */}
                  <div className="glass-inner-card rounded-xl p-6 border-l-4 border-l-[#ADCCED] text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#ADCCED]/20 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-[#ADCCED]" />
                        </div>
                        <div>
                          <Label
                            htmlFor="leetcode-contests"
                            className="text-white font-semibold text-lg cursor-pointer"
                          >
                            Leetcode Contests
                          </Label>
                          <p className="text-[#bbcfe2] text-sm mt-1">
                            Stay updated on Leetcode competitions
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setLeetcodeShow(!leetcodeShow)}
                        className="flex items-center justify-between rounded-full ring-2 text-white px-4 py-2  hover:bg-gray-700 transition"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            leetcodeShow ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {leetcodeShow && (
                      <div className="mt-4 ml-16 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#bbcfe2]">
                              Subscribe to leetcode calendar
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={LEETCODE_CAL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 "
                              onClick={() =>
                                handleSettingChange(
                                  "leetcode_calendar",
                                  true
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">Subscribe</span>
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-[#bbcfe2]">
                            Receive email alerts for leetcode contests
                          </p>
                          <Checkbox
                            id="leetcode-mail"
                            checked={tempSettings.leetcode}
                            onCheckedChange={(checked) =>
                              handleSettingChange("leetcode", checked)
                            }
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {showApplyButton && (

                  <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">

                    <Button

                      onClick={applyChanges}

                      className="flex-1 glass-button-primary py-4 rounded-xl font-semibold text-lg text-white"

                    >

                      Apply Changes

                    </Button>

                    <Button

                      onClick={resetChanges}

                      className="px-8 glass-button rounded-xl font-medium text-white"

                    >

                      Reset

                    </Button>

                  </div>

                )}

              </div>

            </div>



            {/* Stats/Info Panel */}

            <div className="space-y-6">

              <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center">

                <div className="flex items-center gap-3 mb-4 mx-auto">

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

                <div className="space-y-3">

                  <div>

                    <p className="text-[#bbcfe2] text-sm">Email</p>

                    <p className="text-white font-medium">{user.email}</p>

                  </div>

                  <div>

                    <p className="text-[#bbcfe2] text-sm">Active Notifications</p>

                    <p className="text-[#ADCCED] font-semibold">

                      {

                        [

                          tempSettings.leetcode,

                          tempSettings.codechef,

                          tempSettings.codeforces,

                          tempSettings.leetcode_contests,

                          tempSettings.codechef_mail,

                          tempSettings.codeforces_mail,

                          tempSettings.leetcode_mail,

                          tempSettings.leetcode_contests_mail,

                        ].filter(Boolean).length

                      }

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* End of grid */}

        </div> {/* <-- closes .grid */}

        </div> {/* <-- closes .max-w-4xl */}

      <ContactForm

        isOpen={showContactForm}

        onClose={() => setShowContactForm(false)}

      />

    </div>

    </div>)}