"use client";

import { useQuery } from "@tanstack/react-query";
import { spacexAPI } from "@/lib/api/spacex";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Rocket,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  YearlyStats,
  SuccessRateStats,
  RocketStats,
  MonthlyStats,
} from "@/lib/api/types";

export default function StatsPage() {
  const { data: launches, isLoading } = useQuery({
    queryKey: ["all-launches-stats"],
    queryFn: async () => {
      const response = await spacexAPI.queryLaunches({
        options: { limit: 1000 },
      });
      return response.docs;
    },
    staleTime: 3600000,
  });

  if (isLoading) {
    return <StatsPageSkeleton />;
  }

  if (!launches) {
    return <div className="text-center text-gray-400">No data available</div>;
  }

  // Calculate statistics
  const launchesByYear = launches.reduce((acc, launch) => {
    const year = new Date(launch.date_utc).getFullYear();
    if (!acc[year]) {
      acc[year] = { year, total: 0, success: 0, failure: 0 };
    }
    acc[year].total++;
    if (launch.success === true) acc[year].success++;
    if (launch.success === false) acc[year].failure++;
    return acc;
  }, {} as Record<string, YearlyStats>);

  const yearlyData: YearlyStats[] = Object.values(launchesByYear).sort(
    (a, b) => a.year - b.year
  );

  // Success rate over time
  const successRateData: SuccessRateStats[] = yearlyData.map((year) => ({
    year: year.year,
    rate: year.total > 0 ? Math.round((year.success / year.total) * 100) : 0,
    launches: year.total,
  }));

  // Rocket statistics
  const rocketStats = launches.reduce((acc, launch) => {
    const rocketId = launch.rocket;
    if (!acc[rocketId]) {
      acc[rocketId] = { name: rocketId, count: 0, success: 0, failure: 0 };
    }
    acc[rocketId].count++;
    if (launch.success === true) acc[rocketId].success++;
    if (launch.success === false) acc[rocketId].failure++;
    return acc;
  }, {} as Record<string, RocketStats>);

  const rocketData: RocketStats[] = Object.values(rocketStats)
    .map((rocket) => ({
      ...rocket,
      successRate:
        rocket.count > 0
          ? Math.round((rocket.success / rocket.count) * 100)
          : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Launch outcomes pie chart
  const pieData = [
    {
      name: "Success",
      value: launches.filter((l) => l.success === true).length,
      color: "#10b981",
    },
    {
      name: "Failure",
      value: launches.filter((l) => l.success === false).length,
      color: "#ef4444",
    },
    {
      name: "Upcoming",
      value: launches.filter((l) => l.upcoming).length,
      color: "#3b82f6",
    },
  ];

  // Monthly distribution
  const monthlyDistribution = launches.reduce((acc, launch) => {
    const month = new Date(launch.date_utc).getMonth();
    const monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][month];
    if (!acc[monthName]) {
      acc[monthName] = { month: monthName, launches: 0 };
    }
    acc[monthName].launches++;
    return acc;
  }, {} as Record<string, MonthlyStats>);

  const monthlyData = Object.values(monthlyDistribution);

  // Payload statistics
  const payloadStats = launches
    .map((l) => ({
      name: l.name,
      payloads: l.payloads.length,
      crew: l.crew.length,
    }))
    .slice(0, 10);

  const successRate =
    (launches.filter((l) => l.success === true).length /
      launches.filter((l) => l.success !== null).length) *
    100;

  const currentYear = new Date().getFullYear();
  const thisYearLaunches = launches.filter(
    (l) => new Date(l.date_utc).getFullYear() === currentYear
  ).length;
  const upcomingCount = launches.filter((l) => l.upcoming).length;

  // Custom tooltip with space theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 p-3 rounded-lg shadow-2xl">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color || "#9ca3af" }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart colors matching the space theme
  const COLORS = {
    purple: "#a855f7",
    blue: "#3b82f6",
    cyan: "#06b6d4",
    green: "#10b981",
    orange: "#f97316",
    pink: "#ec4899",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Activity className="w-8 h-8 text-purple-400 animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Launch Statistics
          </h1>
          <Activity
            className="w-8 h-8 text-blue-400 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <p className="text-gray-300 text-lg">
          Analyzing {launches.length} SpaceX launches across the cosmos
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-600/10 rounded-xl blur-xl group-hover:from-purple-600/30 group-hover:to-purple-600/20 transition-all duration-300"></div>
          <Card className="relative bg-gray-900/80 backdrop-blur-xl border-purple-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Launches</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {launches.length}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">All time</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Rocket className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-600/10 rounded-xl blur-xl group-hover:from-green-600/30 group-hover:to-green-600/20 transition-all duration-300"></div>
          <Card className="relative bg-gray-900/80 backdrop-blur-xl border-green-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {successRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-green-400/70 mt-1">
                    Mission success
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-600/10 rounded-xl blur-xl group-hover:from-blue-600/30 group-hover:to-blue-600/20 transition-all duration-300"></div>
          <Card className="relative bg-gray-900/80 backdrop-blur-xl border-blue-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">
                    {upcomingCount}
                  </p>
                  <p className="text-xs text-blue-400/70 mt-1">
                    Scheduled launches
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-600/10 rounded-xl blur-xl group-hover:from-orange-600/30 group-hover:to-orange-600/20 transition-all duration-300"></div>
          <Card className="relative bg-gray-900/80 backdrop-blur-xl border-orange-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">This Year</p>
                  <p className="text-3xl font-bold text-orange-400 mt-1">
                    {thisYearLaunches}
                  </p>
                  <p className="text-xs text-orange-400/70 mt-1">
                    {currentYear} launches
                  </p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Launches by Year */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Launches by Year
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="success"
                  stackId="a"
                  fill={COLORS.green}
                  name="Success"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="failure"
                  stackId="a"
                  fill="#ef4444"
                  name="Failure"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Launch Outcomes Pie Chart */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Launch Outcomes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent || 0 * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Success Rate Trend */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Success Rate Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successRateData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={COLORS.green}
                  strokeWidth={3}
                  name="Success Rate %"
                  dot={{ fill: COLORS.green, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Most Used Rockets */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-400" />
              Most Used Rockets
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rocketData} layout="horizontal">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  stroke="#9ca3af"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.purple}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Distribution */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Monthly Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="launches"
                  stroke={COLORS.cyan}
                  fill={COLORS.cyan}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Rocket Success Rates */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-pink-400" />
              Rocket Success Rates
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rocketData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="successRate"
                  fill={COLORS.pink}
                  name="Success Rate %"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Launch Timeline
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={yearlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.purple}
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS.purple}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.purple}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  Total Rockets Used
                </span>
                <span className="text-white font-bold">
                  {Object.keys(rocketStats).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  Average Launches/Year
                </span>
                <span className="text-white font-bold">
                  {Math.round(launches.length / yearlyData.length)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Most Active Year</span>
                <span className="text-white font-bold">
                  {
                    yearlyData.reduce(
                      (max: any, year: any) =>
                        year.total > (max?.total || 0) ? year : max,
                      null
                    )?.year
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Crewed Missions</span>
                <span className="text-white font-bold">
                  {launches.filter((l) => l.crew.length > 0).length}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="h-12 w-80 bg-gray-800/50 rounded-lg mx-auto animate-pulse"></div>
        <div className="h-6 w-96 bg-gray-800/50 rounded-lg mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-800/50 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-800/50 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
