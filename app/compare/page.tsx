"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLaunch, useRocket, useLaunchpad } from "@/lib/hooks/useLaunches";
import { useLaunches } from "@/lib/hooks/useLaunches";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Clock,
  Minus,
  Plus,
  GitCompare,
  ChevronDown,
  Calendar,
  Rocket as RocketIcon,
  MapPin,
  Users,
  Package,
  AlertCircle,
  Share2,
  Check,
  Zap,
  Activity,
  Target,
  Globe,
  Gauge,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Launch } from "@/lib/api/types";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const launch1Id = searchParams.get("launch1");
  const launch2Id = searchParams.get("launch2");

  const [showLaunchSelector, setShowLaunchSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch launch data
  const { data: launch1, isLoading: loading1 } = useLaunch(launch1Id || "");
  const { data: launch2, isLoading: loading2 } = useLaunch(launch2Id || "");

  // Fetch related data
  const { data: rocket1 } = useRocket(launch1?.rocket || "");
  const { data: rocket2 } = useRocket(launch2?.rocket || "");

  const { data: launchpad1 } = useLaunchpad(launch1?.launchpad || "");
  const { data: launchpad2 } = useLaunchpad(launch2?.launchpad || "");

  // Fetch launches for selector
  const { data: launchesData } = useLaunches({
    search: searchQuery,
    limit: 10,
  });

  const availableLaunches = launchesData?.pages?.[0]?.docs || [];

  // Add starfield effect
  useEffect(() => {
    const createStars = () => {
      const stars = document.getElementById("stars");
      if (!stars) return;

      stars.innerHTML = "";
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        stars.appendChild(star);
      }
    };

    createStars();
  }, []);

  const handleSelectLaunch = (launchId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectorPosition === 1) {
      params.set("launch1", launchId);
    } else if (selectorPosition === 2) {
      params.set("launch2", launchId);
    }

    router.push(`/compare?${params.toString()}`);
    setShowLaunchSelector(false);
    setSelectorPosition(null);
  };

  const handleRemoveLaunch = (position: 1 | 2) => {
    const params = new URLSearchParams(searchParams.toString());

    if (position === 1) {
      params.delete("launch1");
    } else {
      params.delete("launch2");
    }

    router.push(`/compare?${params.toString()}`);
  };

  const handleShareComparison = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "SpaceX Launch Comparison",
          text: `Compare ${launch1?.name || "Launch 1"} vs ${
            launch2?.name || "Launch 2"
          }`,
          url,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const StatusBadge = ({ launch }: { launch: Launch | null }) => {
    if (!launch) return <Minus className="w-4 h-4 text-gray-500" />;

    if (launch.upcoming) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
          <Clock className="w-3 h-3" />
          Upcoming
        </span>
      );
    }
    if (launch.success === true) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
          <CheckCircle className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (launch.success === false) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-sm font-medium border border-red-500/30">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 text-gray-300 rounded-full text-sm font-medium border border-gray-500/30">
        Unknown
      </span>
    );
  };

  const ComparisonRow = ({
    label,
    value1,
    value2,
    highlight = false,
    icon,
  }: {
    label: string;
    value1: React.ReactNode;
    value2: React.ReactNode;
    highlight?: boolean;
    icon?: React.ReactNode;
  }) => {
    const isDifferent = value1 !== value2 && value1 && value2;

    return (
      <tr
        className={`border-b border-gray-700/50 hover:bg-white/5 transition-all duration-300 ${
          highlight ? "bg-purple-500/10" : ""
        }`}
      >
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            {icon && <div className="text-purple-400">{icon}</div>}
            <span className="text-gray-200 font-medium">{label}</span>
          </div>
        </td>
        <td
          className={`py-4 px-6 ${
            isDifferent ? "text-cyan-300 font-semibold" : "text-gray-300"
          }`}
        >
          {value1 || <Minus className="w-4 h-4 text-gray-600" />}
        </td>
        <td
          className={`py-4 px-6 ${
            isDifferent ? "text-cyan-300 font-semibold" : "text-gray-300"
          }`}
        >
          {value2 || <Minus className="w-4 h-4 text-gray-600" />}
        </td>
      </tr>
    );
  };

  const LaunchSelector = ({ position }: { position: 1 | 2 }) => {
    const currentId = position === 1 ? launch1Id : launch2Id;
    const currentLaunch = position === 1 ? launch1 : launch2;

    if (currentId && currentLaunch) {
      return (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative p-6 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-md opacity-50"></div>
                  {currentLaunch.links.patch.small ? (
                    <Image
                      src={currentLaunch.links.patch.small}
                      alt={currentLaunch.name}
                      width={56}
                      height={56}
                      className="relative rounded-lg"
                    />
                  ) : (
                    <div className="relative w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                      <RocketIcon className="w-7 h-7 text-purple-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">
                    {currentLaunch.name}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(currentLaunch.date_utc), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/launches/${currentId}`}
                  className="p-2.5 bg-gray-800/80 hover:bg-purple-900/30 rounded-lg transition-all duration-200 group/btn"
                  title="View details"
                >
                  <AlertCircle className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-300 transition-colors" />
                </Link>
                <button
                  onClick={() => handleRemoveLaunch(position)}
                  className="p-2.5 bg-gray-800/80 hover:bg-red-900/30 rounded-lg transition-all duration-200 group/btn"
                  title="Remove from comparison"
                >
                  <XCircle className="w-4 h-4 text-gray-400 group-hover/btn:text-red-400 transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setSelectorPosition(position);
                    setShowLaunchSelector(true);
                  }}
                  className="p-2.5 bg-gray-800/80 hover:bg-blue-900/30 rounded-lg transition-all duration-200 group/btn"
                  title="Change launch"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => {
          setSelectorPosition(position);
          setShowLaunchSelector(true);
        }}
        className="relative group w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-12 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500/50 bg-gray-900/50 backdrop-blur transition-all duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-purple-900/30 rounded-full">
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-300 group-hover:text-purple-300 transition-colors font-medium">
              Select Launch {position}
            </p>
          </div>
        </div>
      </button>
    );
  };

  if (loading1 || loading2) {
    return <ComparisonSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 relative">
      {/* Animated starfield background */}
      <div id="stars" className="fixed inset-0 pointer-events-none"></div>

      {/* Gradient orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="fixed bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Launch Comparison
            </h1>
            <Sparkles
              className="w-8 h-8 text-blue-400 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <p className="text-gray-300 text-lg">
            Analyze and compare SpaceX missions across the cosmos
          </p>
        </div>

        {/* Launch Selectors */}
        <div className="grid md:grid-cols-2 gap-6">
          <LaunchSelector position={1} />
          <LaunchSelector position={2} />
        </div>

        {/* Comparison Tables */}
        {launch1 && launch2 && (
          <>
            {/* Mission Details */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-gray-700/50">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Mission Details
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sr-only">
                      <tr>
                        <th>Attribute</th>
                        <th>{launch1.name}</th>
                        <th>{launch2.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ComparisonRow
                        label="Flight Number"
                        value1={
                          <span className="text-cyan-300 font-mono">
                            #{launch1.flight_number}
                          </span>
                        }
                        value2={
                          <span className="text-cyan-300 font-mono">
                            #{launch2.flight_number}
                          </span>
                        }
                        icon={<RocketIcon className="w-4 h-4" />}
                      />
                      <ComparisonRow
                        label="Launch Date"
                        value1={
                          <span className="text-white">
                            {format(new Date(launch1.date_utc), "PPP")}
                          </span>
                        }
                        value2={
                          <span className="text-white">
                            {format(new Date(launch2.date_utc), "PPP")}
                          </span>
                        }
                        icon={<Calendar className="w-4 h-4" />}
                      />
                      <ComparisonRow
                        label="Launch Time"
                        value1={
                          <span className="font-mono text-gray-200">
                            {format(new Date(launch1.date_utc), "HH:mm:ss")} UTC
                          </span>
                        }
                        value2={
                          <span className="font-mono text-gray-200">
                            {format(new Date(launch2.date_utc), "HH:mm:ss")} UTC
                          </span>
                        }
                        icon={<Clock className="w-4 h-4" />}
                      />
                      <ComparisonRow
                        label="Mission Status"
                        value1={<StatusBadge launch={launch1} />}
                        value2={<StatusBadge launch={launch2} />}
                        highlight
                        icon={<Target className="w-4 h-4" />}
                      />
                      <ComparisonRow
                        label="Crew Size"
                        value1={
                          launch1.crew.length > 0 ? (
                            <span className="text-orange-300 font-medium">
                              {launch1.crew.length} astronauts
                            </span>
                          ) : (
                            <span className="text-gray-400">Uncrewed</span>
                          )
                        }
                        value2={
                          launch2.crew.length > 0 ? (
                            <span className="text-orange-300 font-medium">
                              {launch2.crew.length} astronauts
                            </span>
                          ) : (
                            <span className="text-gray-400">Uncrewed</span>
                          )
                        }
                        icon={<Users className="w-4 h-4" />}
                      />
                      <ComparisonRow
                        label="Payloads"
                        value1={
                          <span className="text-purple-300 font-medium">
                            {launch1.payloads.length}
                          </span>
                        }
                        value2={
                          <span className="text-purple-300 font-medium">
                            {launch2.payloads.length}
                          </span>
                        }
                        icon={<Package className="w-4 h-4" />}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rocket Comparison */}
            {(rocket1 || rocket2) && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl blur-xl"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Rocket Specifications
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <ComparisonRow
                          label="Rocket Name"
                          value1={
                            <span className="text-orange-300 font-bold">
                              {rocket1?.name}
                            </span>
                          }
                          value2={
                            <span className="text-orange-300 font-bold">
                              {rocket2?.name}
                            </span>
                          }
                          highlight
                          icon={<RocketIcon className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Rocket Type"
                          value1={
                            <span className="text-gray-200">
                              {rocket1?.type}
                            </span>
                          }
                          value2={
                            <span className="text-gray-200">
                              {rocket2?.type}
                            </span>
                          }
                          icon={<Target className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Height"
                          value1={
                            rocket1 ? (
                              <span className="font-mono text-gray-200">
                                {rocket1.height.meters}m / {rocket1.height.feet}
                                ft
                              </span>
                            ) : null
                          }
                          value2={
                            rocket2 ? (
                              <span className="font-mono text-gray-200">
                                {rocket2.height.meters}m / {rocket2.height.feet}
                                ft
                              </span>
                            ) : null
                          }
                          icon={<TrendingUp className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Diameter"
                          value1={
                            rocket1 ? (
                              <span className="font-mono text-gray-200">
                                {rocket1.diameter.meters}m /{" "}
                                {rocket1.diameter.feet}ft
                              </span>
                            ) : null
                          }
                          value2={
                            rocket2 ? (
                              <span className="font-mono text-gray-200">
                                {rocket2.diameter.meters}m /{" "}
                                {rocket2.diameter.feet}ft
                              </span>
                            ) : null
                          }
                          icon={<Gauge className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Mass"
                          value1={
                            rocket1 ? (
                              <span className="text-yellow-300 font-mono">
                                {rocket1.mass.kg.toLocaleString()} kg
                              </span>
                            ) : null
                          }
                          value2={
                            rocket2 ? (
                              <span className="text-yellow-300 font-mono">
                                {rocket2.mass.kg.toLocaleString()} kg
                              </span>
                            ) : null
                          }
                          icon={<Package className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Stages"
                          value1={
                            <span className="text-gray-200">
                              {rocket1?.stages}
                            </span>
                          }
                          value2={
                            <span className="text-gray-200">
                              {rocket2?.stages}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Boosters"
                          value1={
                            <span className="text-gray-200">
                              {rocket1?.boosters}
                            </span>
                          }
                          value2={
                            <span className="text-gray-200">
                              {rocket2?.boosters}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Cost per Launch"
                          value1={
                            rocket1 ? (
                              <span className="text-green-300 font-bold">
                                $
                                {(rocket1.cost_per_launch / 1000000).toFixed(0)}
                                M
                              </span>
                            ) : null
                          }
                          value2={
                            rocket2 ? (
                              <span className="text-green-300 font-bold">
                                $
                                {(rocket2.cost_per_launch / 1000000).toFixed(0)}
                                M
                              </span>
                            ) : null
                          }
                        />
                        <ComparisonRow
                          label="Success Rate"
                          value1={
                            rocket1 ? (
                              <span className="text-emerald-300 font-bold">
                                {rocket1.success_rate_pct}%
                              </span>
                            ) : null
                          }
                          value2={
                            rocket2 ? (
                              <span className="text-emerald-300 font-bold">
                                {rocket2.success_rate_pct}%
                              </span>
                            ) : null
                          }
                          highlight
                        />
                        <ComparisonRow
                          label="First Flight"
                          value1={
                            <span className="text-gray-200">
                              {rocket1?.first_flight}
                            </span>
                          }
                          value2={
                            <span className="text-gray-200">
                              {rocket2?.first_flight}
                            </span>
                          }
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Launchpad Comparison */}
            {(launchpad1 || launchpad2) && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl blur-xl"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      Launch Site Information
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <ComparisonRow
                          label="Site Name"
                          value1={
                            <span className="text-emerald-300 font-bold">
                              {launchpad1?.name}
                            </span>
                          }
                          value2={
                            <span className="text-emerald-300 font-bold">
                              {launchpad2?.name}
                            </span>
                          }
                          icon={<MapPin className="w-4 h-4" />}
                          highlight
                        />
                        <ComparisonRow
                          label="Full Name"
                          value1={
                            <span className="text-gray-200">
                              {launchpad1?.full_name}
                            </span>
                          }
                          value2={
                            <span className="text-gray-200">
                              {launchpad2?.full_name}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Location"
                          value1={
                            launchpad1 ? (
                              <span className="text-gray-200">
                                {launchpad1.locality}, {launchpad1.region}
                              </span>
                            ) : null
                          }
                          value2={
                            launchpad2 ? (
                              <span className="text-gray-200">
                                {launchpad2.locality}, {launchpad2.region}
                              </span>
                            ) : null
                          }
                          icon={<Globe className="w-4 h-4" />}
                        />
                        <ComparisonRow
                          label="Status"
                          value1={
                            launchpad1?.status === "active" ? (
                              <span className="text-green-300">Active</span>
                            ) : (
                              <span className="text-gray-400">
                                {launchpad1?.status}
                              </span>
                            )
                          }
                          value2={
                            launchpad2?.status === "active" ? (
                              <span className="text-green-300">Active</span>
                            ) : (
                              <span className="text-gray-400">
                                {launchpad2?.status}
                              </span>
                            )
                          }
                        />
                        <ComparisonRow
                          label="Launch Attempts"
                          value1={
                            <span className="font-mono text-gray-200">
                              {launchpad1?.launch_attempts}
                            </span>
                          }
                          value2={
                            <span className="font-mono text-gray-200">
                              {launchpad2?.launch_attempts}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Launch Successes"
                          value1={
                            <span className="text-green-300 font-mono">
                              {launchpad1?.launch_successes}
                            </span>
                          }
                          value2={
                            <span className="text-green-300 font-mono">
                              {launchpad2?.launch_successes}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Success Rate"
                          value1={
                            launchpad1 && launchpad1.launch_attempts > 0 ? (
                              <span className="text-emerald-300 font-bold">
                                {Math.round(
                                  (launchpad1.launch_successes /
                                    launchpad1.launch_attempts) *
                                    100
                                )}
                                %
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )
                          }
                          value2={
                            launchpad2 && launchpad2.launch_attempts > 0 ? (
                              <span className="text-emerald-300 font-bold">
                                {Math.round(
                                  (launchpad2.launch_successes /
                                    launchpad2.launch_attempts) *
                                    100
                                )}
                                %
                              </span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )
                          }
                          highlight
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Core/Booster Comparison */}
            {(launch1.cores.length > 0 || launch2.cores.length > 0) && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl blur-xl"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-orange-900/50 to-red-900/50 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <Activity className="w-5 h-5 text-orange-400" />
                      Core/Booster Information
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <ComparisonRow
                          label="Number of Cores"
                          value1={
                            <span className="font-mono text-orange-300">
                              {launch1.cores.length}
                            </span>
                          }
                          value2={
                            <span className="font-mono text-orange-300">
                              {launch2.cores.length}
                            </span>
                          }
                        />
                        <ComparisonRow
                          label="Core Reused"
                          value1={
                            launch1.cores.some((c) => c.reused) ? (
                              <span className="text-green-300 font-medium">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )
                          }
                          value2={
                            launch2.cores.some((c) => c.reused) ? (
                              <span className="text-green-300 font-medium">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )
                          }
                        />
                        <ComparisonRow
                          label="Landing Attempted"
                          value1={
                            launch1.cores.some((c) => c.landing_attempt) ? (
                              <span className="text-blue-300 font-medium">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )
                          }
                          value2={
                            launch2.cores.some((c) => c.landing_attempt) ? (
                              <span className="text-blue-300 font-medium">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )
                          }
                        />
                        <ComparisonRow
                          label="Landing Success"
                          value1={
                            launch1.cores.some((c) => c.landing_success) ? (
                              <span className="text-emerald-300 font-bold">
                                ✓ Success
                              </span>
                            ) : launch1.cores.some((c) => c.landing_attempt) ? (
                              <span className="text-red-300">✗ Failed</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )
                          }
                          value2={
                            launch2.cores.some((c) => c.landing_success) ? (
                              <span className="text-emerald-300 font-bold">
                                ✓ Success
                              </span>
                            ) : launch2.cores.some((c) => c.landing_attempt) ? (
                              <span className="text-red-300">✗ Failed</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )
                          }
                          highlight
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">
                      Share this comparison
                    </h3>
                    <p className="text-gray-300">
                      Send this comparison to others or save it for later
                      reference
                    </p>
                  </div>
                  <Button
                    onClick={handleShareComparison}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        Share Link
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <code className="text-xs text-gray-300 break-all font-mono">
                    {typeof window !== "undefined" ? window.location.href : ""}
                  </code>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!launch1 && !launch2 && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl p-16 text-center">
              <GitCompare className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-3">
                No launches selected
              </h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Select two launches above to start comparing their missions,
                rockets, and performance
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg">
                  Browse Launches
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Launch Selector Modal */}
        {showLaunchSelector && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative group max-w-2xl w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900/95 backdrop-blur rounded-xl border border-gray-700/50 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      Select Launch {selectorPosition}
                    </h2>
                    <button
                      onClick={() => {
                        setShowLaunchSelector(false);
                        setSelectorPosition(null);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-300 hover:text-white" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search launches..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {availableLaunches.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No launches found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableLaunches.map((launch) => (
                        <button
                          key={launch.id}
                          onClick={() => handleSelectLaunch(launch.id)}
                          disabled={
                            launch.id === launch1Id || launch.id === launch2Id
                          }
                          className="w-full p-4 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <div className="flex items-center gap-4">
                            {launch.links.patch.small ? (
                              <Image
                                src={launch.links.patch.small}
                                alt={launch.name}
                                width={44}
                                height={44}
                                className="rounded-lg"
                              />
                            ) : (
                              <div className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center">
                                <RocketIcon className="w-6 h-6 text-purple-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                {launch.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {format(
                                  new Date(launch.date_utc),
                                  "MMM d, yyyy"
                                )}{" "}
                                • Flight #{launch.flight_number}
                              </p>
                            </div>
                            {(launch.id === launch1Id ||
                              launch.id === launch2Id) && (
                              <span className="text-xs bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                                Selected
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function ComparisonSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="h-12 w-80 mx-auto bg-gray-800/50 rounded animate-pulse"></div>
          <div className="h-6 w-96 mx-auto bg-gray-800/50 rounded animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-36 bg-gray-800/50 rounded-xl animate-pulse"></div>
          <div className="h-36 bg-gray-800/50 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-800/50 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-gray-800/50 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
