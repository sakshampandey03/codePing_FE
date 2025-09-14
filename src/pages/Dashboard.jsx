import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

import * as Switch from "@radix-ui/react-switch";
import { apiConnector } from "../../utils/apis.js";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  Trophy,
  Target,
  Flame,
  Code2,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Activity,
  Share2,
} from "lucide-react";
import Heatmap from "@/components/ui/Heatmap";

import { fetchUserStats } from "../../utils/fetchStats.js";
import { formatStats } from "../../utils/formatterService.js";

import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
const secretKey = import.meta.env.VITE_SECRET_KEY;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  // const [lastUpdated] = useState(new Date().toLocaleString());
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [copied, setCopy] = useState(false);
  const [compare, setCompare] = useState(false);
  const [compareStats, setCompareStats] = useState(null);
  const [cohort, setCohort] = useState("");

  async function load(emailValue) {
    try {
      const raw = await fetchUserStats(emailValue);
      const formatted = formatStats(raw);
      setStats(formatted);
      // console.log("----------------hers the main st-------------\n",formatted, "\n\n");
      const userResponse = await apiConnector(
        "GET",
        "/getuserbymail",
        null,
        {},
        {
          email: emailValue,
        }
      );

      // -----------------fetch the cohort avg user data email -> year -> avgUserEmail
      // ----------------- format this data in a new formatter as the old one doesnt contain all the fields
      // ------------------ fetch the formated data and edit the dashboard to show those data

      if (!userResponse?.user) {
        console.error("No User found ");
        setLoading(false);
      } else {
        setUser(userResponse.user);
        const ch = userResponse.user.cohort;
        setCohort(ch);
        const compSt = await fetchUserStats(`${ch}cohort.local`);
        const formattedCompare = formatStats(compSt);

        setCompareStats(formattedCompare);
              // console.log("----------------hers the comp st-------------\n",formattedCompare);
        // console.log(compareStats)
      }
    } catch (error) {
      console.log("Error in fetching stats and userDetails", error);
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    setLoading(true);
    const userResponse = await apiConnector("POST", "/update_stats", { email });
    if (userResponse.success) {
      load(email);
    } else {
      toast.error("could not refresh stats at the moment");
    }
  };
  const handleShare = () => {
    setCopy(true);
    const url1 = window.location.href;
    navigator.clipboard.writeText(url1);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParams = params.get("email");
    setToken(emailParams);
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(emailParams),
      secretKey
    );
    const emailId = bytes.toString(CryptoJS.enc.Utf8);

    if (emailId) {
      setEmail(emailId);
      load(emailId);

    } else {
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="bg-[#36404A] bg-cover w-screen h-screen flex items-center justify-center overflow-hidden">
        <div className="loader"></div>
      </div>
    );
  }

  if (!stats) return <div>No stats available yet</div>;

  return (
    <div className="min-h-screen bg-[#36404A] text-white relative overflow-hidden">
      {/* Background blur circles for consistency */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-[#6D8196] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#ADCCED] rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen backdrop-blur-xl bg-white/5 border-r border-white/10">
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-8">
              <Avatar className="h-12 w-12 ring-2 ring-[#ADCCED]/50">
                <img
                  src={user?.avatar || "https://github.com/shadcn.png"}
                  alt="User Avatar"
                />
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{user?.name}</h3>
                <p className="text-sm text-[#bbcfe2]">
                  {cohort ? cohort : "student"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "leetcode", label: "LeetCode", icon: Code2 },
                { id: "codeforces", label: "Codeforces", icon: Trophy },
                { id: "atcoder", label: "AtCoder", icon: Target },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-[#6D8196]/30 border border-[#ADCCED]/40 shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-[#ADCCED]" />
                  <span className="font-medium text-white">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "leetcode" && "LeetCode Statistics"}
                {activeTab === "codeforces" && "Codeforces Statistics"}
                {activeTab === "atcoder" && "AtCoder Statistics"}
              </h1>
              {/* <p className="text-[#bbcfe2]">Last updated: {lastUpdated}</p> */}
            </div>

            <div className="flex flex-col">
              <div>
                <Button
                  variant="outline"
                  className="glass-button-primary px-4 py-2 rounded-xl text-[#ADCCED] mr-4"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mx-2" />
                  {copied ? "Copied !" : "Share Dashboard"}
                </Button>
                <Button
                  variant="outline"
                  className="glass-button-primary px-4 py-2 rounded-xl text-[#ADCCED]"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="flex items-center text-2xl mx-auto m-4 text-[#ADCCED]">
                <label className="mr-3 ">Compare With Peers</label>
                <Switch.Root
                  className="w-11 h-6 bg-gray-500 rounded-full relative data-[state=compare]:bg-blue-500"
                  checked={compare}
                  onCheckedChange={() => setCompare(!compare)}
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0 data-[state=checked]:translate-x-5" />
                </Switch.Root>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Solved",
                    value: stats.overviewStats.totalSolved,
                    compareValue: compareStats?.overviewStats?.totalSolved || 0,
                    icon: Code2,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Current Streak",
                    value: stats.overviewStats.currentStreak,
                    compareValue:
                      compareStats?.overviewStats?.currentStreak || 0,
                    icon: Flame,
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    title: "Max Streak",
                    value: stats.overviewStats.maxStreak,
                    compareValue: compareStats?.overviewStats?.maxStreak || 0,
                    icon: TrendingUp,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Contests",
                    value: stats.overviewStats.contestsAttended,
                    compareValue:
                      compareStats?.overviewStats?.contestsAttended || 0,
                    icon: Trophy,
                    color: "from-purple-500 to-pink-500",
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl pt-2 pb-0"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#bbcfe2]">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold text-[#bbcfe2]">
                            {stat.value}
                          </p>
                          {compare && (
                            <p className="text-sm text-purple-300 mt-1">
                              {cohort} avg: {stat.compareValue}
                            </p>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                        >
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 mx-auto">
                {/* Topic Distribution */}
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Problems by Topic</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        // here we have first put map function then find function which returns match then final map is filled with this match contents(no of solved )
                        data={
                          compare
                            ? stats.tagData.map((tag) => {
                                const match = compareStats?.tagData?.find(
                                  (t) => t.tag === tag.tag
                                );
                                return {
                                  tag: tag.tag,
                                  solved: tag.solved,
                                  compareSolved: match ? match.solved : 0,
                                };
                              })
                            : stats.tagData
                        }
                        margin={{ bottom: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="white" />
                        <XAxis
                          dataKey="tag"
                          angle={-45}
                          textAnchor="end"
                          interval={0}
                          tick={{ fontSize: 12, fill: "white" }}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "white" }} />
                        <Tooltip />
                        <Bar
                          dataKey="solved"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                        {compare && (
                          <Bar
                            dataKey="compareSolved"
                            fill="#8B5CF6"
                            radius={[4, 4, 0, 0]}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Rating Trends */}
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Rating Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="contest"
                          tick={{ fontSize: 12, fill: "white" }}
                          type="category"
                          allowDuplicatedCategory={false}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "grey" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30,41,59,0.9)", // dark slate background
                            border: "none",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#F8FAFC", fontWeight: "600" }} // label text
                          itemStyle={{ color: "#F8FAFC", fontWeight: "500" }} // value text
                          cursor={{
                            stroke: "rgba(255,255,255,0.3)",
                            strokeWidth: 2,
                          }}
                        />

                        {/* User lines */}
                        <Line
                          type="monotone"
                          dataKey="leetcode"
                          data={stats.ratingTrend}
                          stroke="#3B82F6"
                          strokeWidth={3}
                        />
                        <Line
                          type="monotone"
                          dataKey="codeforces"
                          data={stats.ratingTrend}
                          stroke="#8B5CF6"
                          strokeWidth={3}
                        />
                        {/* Cohort lines */}
                        {compare && (
                          <>
                            <Line
                              type="monotone"
                              dataKey="leetcode avg"
                              data={compareStats?.ratingTrend || []}
                              stroke="#22C55E"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                            <Line
                              type="monotone"
                              dataKey="codeforces avg"
                              data={compareStats?.ratingTrend || []}
                              stroke="#F97316"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* LeetCode Tab */}
          {activeTab === "leetcode" &&
            (user.leetcode_username ? (
              <div className="space-y-6">
                {/* ===== Topic Cards ===== */}
                <div className="grid grid-cols-1 md:grid-cols-4 mx-auto gap-6 w-3/4">
                  {stats.topicData?.map(({ topic, solved }) => {
                    const compareSolved = compare
                      ? compareStats?.topicData?.find((t) => t.topic === topic)
                          ?.solved || 0
                      : null;

                    const total =
                      topic === "Easy"
                        ? 896
                        : topic === "Medium"
                        ? 1914
                        : topic === "Hard"
                        ? 867
                        : 3677;

                    const percent = total
                      ? Math.round((solved / total) * 100)
                      : 0;
                    const comparePercent = compareSolved
                      ? Math.round((compareSolved / total) * 100)
                      : null;

                    const colors = {
                      Easy: "text-green-600 dark:text-green-400",
                      Medium: "text-yellow-600 dark:text-yellow-400",
                      Hard: "text-red-600 dark:text-red-400",
                    };

                    return (
                      <Card
                        key={topic}
                        className={`backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl `}

                      >
                        <CardHeader>
                          <CardTitle className={colors[topic]}>
                            {topic}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* User Data */}
                          <div className="text-3xl font-bold mb-2">
                            {solved} / {total}
                          </div>
                          {/* <Progress value={percent} className="mb-2" /> */}
                          <p className="text-sm text-[#bbcfe2] mb-4">
                            {percent}% Complete
                          </p>

                          {/* Compare Data */}
                          {compare && (
                            <>
                              <div className="text-xl font-semibold text-white-400 mb-1">
                                Cohort Avg: {compareSolved}
                              </div>
                              {/* <Progress
                                value={comparePercent}
                                className="mb-2 bg-green-600"
                              /> */}
                              <p className="text-xs text-green-300">
                                {comparePercent}% Complete
                              </p>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* ===== Contest Performance ===== */}
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl w-3/4 mx-auto">
                  <CardHeader>
                    <CardTitle>Contest Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Current Rating</h4>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round(stats?.rating) || 0}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {stats.badge}
                        </Badge>

                        {compare && (
                          <div className="mt-4">
                            <h5 className="text-sm text-green-400">
                              Cohort Avg
                            </h5>
                            <div className="text-xl font-semibold text-green-400">
                              {Math.round(compareStats?.rating) || 0}
                            </div>
                            <Badge variant="secondary" className="mt-2">
                              {compareStats?.badge}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Global Ranking</h4>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          #{stats?.globalRank || "N/A"}
                        </div>

                        {compare && (
                          <div className="mt-4">
                            <h5 className="text-sm text-green-400">
                              Cohort Avg Rank
                            </h5>
                            <div className="text-xl font-semibold text-green-400">
                              #{compareStats?.globalRank || "N/A"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ===== Heatmap (unchanged) ===== */}
                <div>
                  {stats.cal && Object.keys(stats.cal).length > 0 && (
                    <Heatmap submissionCalendar={stats.cal} />
                  )}
                </div>

                {/* ===== Rating Trends ===== */}
                <div>
                  <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span>Rating Trends</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer
                        width="75%"
                        height={300}
                        className="mx-auto"
                      >
                        <LineChart
                          data={stats.leetcode_contest_data}
                          margin={{ bottom: 100 }}
                        >
                          <CartesianGrid
                            strokeDasharray="1 1"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="contest"
                            tick={{ fontSize: 12, fill: "white" }}
                            angle={-90}
                            textAnchor="end"
                            interval={1}
                          />
                          <YAxis tick={{ fontSize: 12, fill: "white" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(30,41,59,0.9)",
                              border: "none",
                              borderRadius: "12px",
                            }}
                            labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
                            itemStyle={{ color: "#F8FAFC", fontWeight: 500 }}
                          />
                          {/* User rating */}
                          <Line
                            type="monotone"
                            dataKey="leetcode"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: "#3B82F6", r: 2 }}
                          />
                          {/* Compare rating */}
                          {compare && (
                            <Line
                              type="monotone"
                              dataKey="leetcode"
                              data={compareStats?.leetcode_contest_data || []}
                              stroke="#22C55E"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* === Placeholder when no handle === */
              <div className="space-y-6">
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-[#bbcfe2]" />
                    <h3 className="text-xl font-semibold mb-2">
                      {activeTab} Integration
                    </h3>
                    <p className="text-[#bbcfe2] mb-4">
                      Connect your {activeTab} account to view detailed
                      statistics and contest performance.
                    </p>
                    <Link to={`/addhandle?email=${encodeURIComponent(token)}`}>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        {`Connect ${activeTab}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}

          {/* Codeforces Tab */}
          {activeTab === "codeforces" &&
            stats.codeforces &&
            (user.codeforces_username ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Current Rating */}
                  <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">
                        {stats.codeforces.rating || 0}
                        {compare &&
                          compareStats?.codeforces?.rating !== undefined && (
                            <div className="ml-2 text-sm text-blue-300">
                              {cohort} avg {compareStats.codeforces.rating}
                            </div>
                          )}
                      </div>
                      <p className="text-sm text-[#bbcfe2] dark:text-[#bbcfe2]">
                        Current Rating
                      </p>
                    </CardContent>
                  </Card>

                  {/* Contests */}
                  <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">
                        {stats.codeforces.totalContests || 0}
                        {compare &&
                          compareStats?.codeforces?.totalContests !==
                            undefined && (
                            <div className="ml-2 text-sm text-blue-300">
                              {cohort} avg  {compareStats.codeforces.totalContests}
                            </div>
                          )}
                      </div>
                      <p className="text-sm text-[#bbcfe2] dark:text-[#bbcfe2]">
                        Contests
                      </p>
                    </CardContent>
                  </Card>

                  {/* Global Rank */}
                  <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">
                        {stats.codeforces.rank || "Unrated"}
                        {/* {compare && compareStats?.codeforces?.rank && (
                          <div className="ml-2 text-sm text-blue-300">
                            {cohort} avg  {compareStats.codeforces.rank}
                          </div>
                        )} */}
                      </div>
                      <p className="text-sm text-[#bbcfe2] dark:text-[#bbcfe2]">
                        Global Rank
                      </p>
                    </CardContent>
                  </Card>

                  {/* Title / Max Rank */}
                  <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <Badge variant="secondary" className="mb-2">
                        {stats.codeforces.rank || "Unrated"}
                      </Badge>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {stats.codeforces.maxRank || "-"}
                       
                      </div>
                      <p className="text-sm text-[#bbcfe2] dark:text-[#bbcfe2]">
                        Rank
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Contest Results */}
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                  <CardHeader>
                    <CardTitle>Recent Contest Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(stats.codeforces.ratingHistory || [])
                        .slice(-5)
                        .reverse()
                        .map((c, index) => {
                          const prev =
                            stats.codeforces.ratingHistory[index - 1];
                          const diff = prev ? c.rating - prev.rating : 0;
                          const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
                          return (
                            <div
                              key={c.contestId || index}
                              className="flex justify-between items-center p-4 rounded-lg bg-white/10 dark:bg-white/5"
                            >
                              <div>
                                <h4 className="font-semibold">
                                  {c.contestName}
                                </h4>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  Rank #{c.rank}
                                </div>
                                <div
                                  className={`text-sm ${
                                    diff > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {diffStr}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* Rating Trends */}
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Rating Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={stats.codeforces_contest_data}
                        margin={{ bottom: 80 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="contest"
                          tick={{ fontSize: 12, fill: "white" }}
                          angle={-90}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "white" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            border: "none",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="codeforces"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                        />
                        {compare && compareStats?.codeforces_contest_data && (
                          <Line
                            type="monotone"
                            data={compareStats.codeforces_contest_data}
                            dataKey="codeforces"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={{ fill: "#F59E0B", strokeWidth: 1, r: 3 }}
                            name="Compare"
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // --- No Username Connected ---
              <div className="space-y-6">
                <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-[#bbcfe2]" />
                    <h3 className="text-xl font-semibold mb-2">
                      {activeTab} Integration
                    </h3>
                    <p className="text-[#bbcfe2] dark:text-[#bbcfe2] mb-4">
                      Connect your {activeTab} account to view detailed
                      statistics and contest performance.
                    </p>
                    <Link to={`/addhandle?email=${encodeURIComponent(token)}`}>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        {`Connect ${activeTab}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}

          {/* AtCoder Tab */}
          {activeTab === "atcoder" && (
            <div className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/5 dark:bg-white/10 border-white/30 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 mx-auto mb-4 text-[#bbcfe2]" />
                  <h3 className="text-xl font-semibold mb-2">
                    {activeTab} Integration
                  </h3>
                  <p className="text-[#bbcfe2] dark:text-[#bbcfe2] mb-4">
                    Connect your {activeTab} account to view detailed statistics
                    and contest performance.
                  </p>
                  <Link to={`/addhandle?email=${encodeURIComponent(token)}`}>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      {`Connect ${activeTab}`}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
