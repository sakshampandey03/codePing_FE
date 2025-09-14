"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Save } from "lucide-react";
import { apiConnector } from "../../utils/apis.js";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

const secretKey = import.meta.env.VITE_SECRET_KEY;

export default function IntegrationsTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailToken = new URLSearchParams(location.search).get("email");

  const [handles, setHandles] = useState({
    leetcode_username: "",
    codeforces_username: "",
    codechef_username: "",
    github_username: "",
  });

  const [cohort, setCohort] = useState("");

  const handleChange = (key, value) => setHandles({ ...handles, [key]: value });

  const handleSave = async () => {
    if (!cohort) {
      toast.error("please select your cohort")
      return;
    }
    try {
      const decoded = decodeURIComponent(emailToken || "");
      const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
      const email = bytes.toString(CryptoJS.enc.Utf8);

      await apiConnector("POST", "/updatehandles", { email, handles, cohort });

      navigate(`/dashboard?email=${encodeURIComponent(emailToken)}`);
    } catch (err) {
      console.error("Error in handleSave:", err);
    }
  };
  async function fetchHandles(){
      const decoded = decodeURIComponent(emailToken || "");
      const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
      const email = bytes.toString(CryptoJS.enc.Utf8);
      const userResponse = await apiConnector(
        "GET",
        "/getuserbymail",
        null,
        {},
        {
          email: email,
        }
      );
      const h1 = {
        leetcode_username: userResponse?.user?.leetcode_username || "",
        codeforces_username: userResponse?.user?.codeforces_username || "",
        codechef_username: userResponse?.user?.codechef_username || "",
        github_username: userResponse?.user?.github_username || "",
      }
      // console.log(h1);
      setHandles(h1);
      if(userResponse.user) setCohort(userResponse?.user?.cohort);
  }
  useEffect(() => {
    fetchHandles();
  }, [])
  // Helper to generate recent years for dropdown
  const list = ["1styr", "2ndyr", "3rdyr", "4thyr", "graduated"];

  return (
    <div className="min-h-screen bg-[#36404A] relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#6D8196] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ADCCED] rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6D8196] rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Add Handles</h1>
          <p className="text-[#bbcfe2] mb-8">
            Connect your coding profiles to personalize your dashboard.
          </p>

          {/* Admission Year Dropdown */}
          <div className="mb-6">
            <Label htmlFor="cohort" className="text-[#ADCCED] text-sm font-medium">
              Select Cohort <span className="text-red-500">*</span>
            </Label>
            <select
              id="cohort"
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="glass-input rounded-lg px-4 py-3 mt-2 w-full bg-white/10 text-white"
              required
            >
              <option value="" disabled>
                Select your Cohort
              </option>
              {list.map((ch) => (
                <option key={ch} value={ch} className="bg-[#36404A] text-white">
                  {ch}
                </option>
              ))}
            </select>
          </div>

          {/* Handles Inputs */}
          <div className="space-y-6">
            {[
              { id: "leetcode_username", label: "LeetCode Username" },
              { id: "codeforces_username", label: "Codeforces Username" },
              { id: "codechef_username", label: "CodeChef Username" },
              { id: "github_username", label: "GitHub Username" },
            ].map(({ id, label }) => (
              <div key={id}>
                <Label htmlFor={id} className="text-[#ADCCED] text-sm font-medium">
                  {label}
                </Label>
                <Input
                  id={id}
                  value={handles[id]}
                  onChange={(e) => handleChange(id, e.target.value)}
                  placeholder={`Enter your ${label}`}
                  className="glass-input rounded-lg px-4 py-3 mt-2 w-full"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-10">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save & Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
