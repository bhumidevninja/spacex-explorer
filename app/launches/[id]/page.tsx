"use client";

import { useParams } from "next/navigation";
import { useLaunch, useRocket, useLaunchpad } from "@/lib/hooks/useLaunches";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Rocket as RocketIcon,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Users,
  Package,
  Activity,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LaunchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: launch,
    isLoading: launchLoading,
    error: launchError,
  } = useLaunch(id);
  const { data: rocket, isLoading: rocketLoading } = useRocket(
    launch?.rocket ?? ""
  );
  const { data: launchpad, isLoading: launchpadLoading } = useLaunchpad(
    launch?.launchpad ?? ""
  );
  const { isFavorite, toggleFavorite } = useFavorites();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCompare = () => {
    router.push(`/compare?launch1=${launch?.id}`);
  };

  if (launchLoading) {
    return <LaunchDetailSkeleton />;
  }

  if (launchError || !launch) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4 text-white">Launch not found</h1>
        <Link href="/" className="text-purple-400 hover:text-purple-300">
          Return to launches
        </Link>
      </div>
    );
  }

  const allImages = [
    launch.links.patch.large,
    ...(launch.links.flickr.original.length > 0
      ? launch.links.flickr.original
      : launch.links.flickr.small),
  ].filter(Boolean) as string[];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to launches
          </Link>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {launch.name}
          </h1>
          <p className="text-gray-400">Flight #{launch.flight_number}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCompare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <GitCompare className="w-5 h-5" />
            Compare
          </Button>
          <Button
            onClick={() => toggleFavorite(launch.id)}
            variant={isFavorite(launch.id) ? "primary" : "outline"}
            className="flex items-center gap-2"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite(launch.id) ? "fill-current" : ""
              }`}
            />
            {isFavorite(launch.id) ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {allImages.length > 0 ? (
            <div className="relative aspect-video glass-card rounded-xl overflow-hidden">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${launch.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video glass-card rounded-xl flex items-center justify-center">
              <RocketIcon className="w-16 h-16 text-purple-400/50" />
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card glowColor="purple">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Mission Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  {launch.upcoming ? (
                    <span className="status-upcoming inline-flex items-center gap-2 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      Upcoming
                    </span>
                  ) : launch.success === true ? (
                    <span className="status-success inline-flex items-center gap-2 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </span>
                  ) : launch.success === false ? (
                    <span className="status-failure inline-flex items-center gap-2 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" />
                      Failed
                    </span>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(launch.date_utc), "PPP")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-cyan-400 font-mono">
                    {format(new Date(launch.date_utc), "HH:mm:ss")} UTC
                  </span>
                </div>
                {launch.crew.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Crew</span>
                    <span className="flex items-center gap-2 text-orange-400">
                      <Users className="w-4 h-4" />
                      {launch.crew.length} astronauts
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payloads</span>
                  <span className="flex items-center gap-2 text-purple-400">
                    <Package className="w-4 h-4" />
                    {launch.payloads.length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Rocket Info */}
          {rocket && (
            <Card glowColor="blue">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <RocketIcon className="w-5 h-5 text-blue-400" />
                  Rocket Specifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Name</span>
                    <span className="font-medium text-orange-400">
                      {rocket.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-gray-300">{rocket.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Height</span>
                    <span className="text-gray-300 font-mono">
                      {rocket.height.meters}m / {rocket.height.feet}ft
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-green-400 font-bold">
                      {rocket.success_rate_pct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Cost per Launch</span>
                    <span className="text-yellow-400 font-bold">
                      ${(rocket.cost_per_launch / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Launchpad Info */}
          {launchpad && (
            <Card glowColor="cyan">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Launch Site
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Name</span>
                    <span className="font-medium text-cyan-400">
                      {launchpad.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {launchpad.locality}, {launchpad.region}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-green-400 font-bold">
                      {launchpad.launch_attempts > 0
                        ? Math.round(
                            (launchpad.launch_successes /
                              launchpad.launch_attempts) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* External Links */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">
                External Links
              </h2>
              <div className="flex flex-wrap gap-3">
                {launch.links.webcast && (
                  <a
                    href={launch.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    YouTube
                  </a>
                )}
                {launch.links.article && (
                  <a
                    href={launch.links.article}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Article
                  </a>
                )}
                {launch.links.wikipedia && (
                  <a
                    href={launch.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Wikipedia
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Details Section */}
      {launch.details && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Mission Details
            </h2>
            <p className="text-gray-300 leading-relaxed">{launch.details}</p>
          </div>
        </Card>
      )}
    </div>
  );
}

function LaunchDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="h-8 w-32 bg-white/10 rounded mb-4 animate-pulse"></div>
        <div className="h-12 w-96 bg-white/10 rounded mb-2 animate-pulse"></div>
        <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="aspect-video bg-white/10 rounded-xl animate-pulse"></div>
        <div className="space-y-6">
          <div className="h-48 bg-white/10 rounded-xl animate-pulse"></div>
          <div className="h-48 bg-white/10 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
