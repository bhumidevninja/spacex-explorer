import { Launch } from "@/lib/api/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  GitCompare,
  Rocket as RocketIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useRouter } from "next/navigation";
import { memo } from "react";

interface LaunchCardProps {
  launch: Launch;
}

export const LaunchCard = memo(function LaunchCard({
  launch,
}: LaunchCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(launch.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/compare?launch1=${launch.id}`);
  };

  return (
    <Link href={`/launches/${launch.id}`}>
      <article className="glass-card glass-card-hover rounded-xl overflow-hidden group">
        <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          {launch.links.patch.small ? (
            <Image
              src={launch.links.patch.small}
              alt={launch.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <RocketIcon className="w-12 h-12 text-purple-400/50" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleCompareClick}
              className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200"
              aria-label="Compare launch"
            >
              <GitCompare className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleFavoriteClick}
              className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 cursor-pointer"
              aria-label={
                isFavorite(launch.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite(launch.id)
                    ? "fill-pink-500 text-pink-500"
                    : "text-white"
                }`}
                fill="currentColor"
              />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {launch.name}
            </h3>
            <p className="text-sm text-gray-400">
              Flight #{launch.flight_number}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4 text-purple-400" />
            <time dateTime={launch.date_utc}>
              {format(new Date(launch.date_utc), "MMM d, yyyy")}
            </time>
          </div>

          <div className="flex items-center justify-between">
            {launch.upcoming ? (
              <span className="status-upcoming inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3" />
                Upcoming
              </span>
            ) : launch.success === true ? (
              <span className="status-success inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Success
              </span>
            ) : launch.success === false ? (
              <span className="status-failure inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium">
                <XCircle className="w-3 h-3" />
                Failed
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-full text-xs">
                Unknown
              </span>
            )}
          </div>

          {launch.details && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {launch.details}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
});
