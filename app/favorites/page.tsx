"use client";

import { useFavoriteLaunches, useFavorites } from "@/lib/hooks/useFavorites";
import { LaunchCard } from "@/components/launches/LaunchCard";
import { LaunchSkeleton } from "@/components/launches/LaunchSkeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favoriteIds, favoriteCount } = useFavorites();
  const { data: launches, isLoading } = useFavoriteLaunches();

  if (favoriteCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <Heart className="relative w-20 h-20 text-pink-400" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">No favorites yet</h1>
        <p className="text-gray-400 text-center max-w-md">
          Start exploring SpaceX launches and save your favorites to see them
          here
        </p>
        <Link href="/">
          <Button variant="primary">Explore Launches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
          <h1 className="text-5xl font-bold gradient-text-hover">
            Your Favorites
          </h1>
          <Heart
            className="w-8 h-8 text-pink-400 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <p className="text-gray-400 text-lg">
          {favoriteCount} {favoriteCount === 1 ? "launch" : "launches"} saved
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(favoriteCount)].map((_, i) => (
            <LaunchSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches?.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}
    </div>
  );
}
