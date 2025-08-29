"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LaunchCard } from "@/components/launches/LaunchCard";
import { LaunchFilters } from "@/components/launches/LaunchFilters";
import { Button } from "@/components/ui/button";
import { AlertCircle, Rocket, Sparkles } from "lucide-react";
import { Filters, LaunchResponse } from "@/lib/api/types";

interface HomePageProps {
  filters: Filters;
  launchData: LaunchResponse | null;
  error: string | null;
}

export default function HomePage({
  filters,
  launchData,
  error,
}: HomePageProps) {
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Function to build URL search parameters from filters
  const buildSearchParams = useCallback((filterParams: Filters) => {
    const params = new URLSearchParams();

    if (filterParams.upcoming !== undefined) {
      params.set("upcoming", String(filterParams.upcoming));
    }
    if (filterParams.success !== undefined) {
      params.set("success", String(filterParams.success));
    }
    if (filterParams.dateRange?.start) {
      params.set("start", filterParams.dateRange.start.toISOString());
    }
    if (filterParams.dateRange?.end) {
      params.set("end", filterParams.dateRange.end.toISOString());
    }
    if (filterParams.search) {
      params.set("search", filterParams.search);
    }
    if (filterParams.sortBy !== "date") {
      params.set("sortBy", filterParams.sortBy);
    }
    if (filterParams.sortOrder !== "desc") {
      params.set("sortOrder", filterParams.sortOrder);
    }
    if (filterParams.limit !== 20) {
      params.set("limit", String(filterParams.limit));
    }

    return params;
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      // Clear any stored scroll position when filters change
      sessionStorage.removeItem("scrollPosition");

      // Reset limit when filters change (except limit itself)
      const filtersToApply = {
        ...newFilters,
        limit: 20, // Always reset to 20 when filters change
      };

      // Update URL with new filters - this triggers server re-fetch
      const params = buildSearchParams(filtersToApply);
      const newUrl = params.toString() ? `/?${params.toString()}` : "/";

      // For filter changes, we want to scroll to top, so use default behavior
      router.push(newUrl);
    },
    [buildSearchParams, router]
  );

  // Handle loading more data via infinite scroll
  const loadMoreData = useCallback(() => {
    if (isLoadingMore || !launchData?.hasNextPage) return;

    setIsLoadingMore(true);

    // Store current scroll position before navigation
    const currentScrollY = window.scrollY;
    sessionStorage.setItem("scrollPosition", String(currentScrollY));

    // Increase limit to load more results
    const newLimit = filters.limit + 20;

    const newFilters = { ...filters, limit: newLimit };
    const params = buildSearchParams(newFilters);
    const newUrl = `/?${params.toString()}`;

    // Navigate to new URL with scroll disabled
    router.push(newUrl, { scroll: false });
  }, [
    isLoadingMore,
    launchData?.hasNextPage,
    filters,
    buildSearchParams,
    router,
  ]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && launchData?.hasNextPage && !isLoadingMore) {
          loadMoreData();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMoreData, launchData?.hasNextPage, isLoadingMore]);

  // Reset loading state when new data arrives and restore scroll position
  useEffect(() => {
    setIsLoadingMore(false);

    // Restore scroll position if it was stored
    const savedScrollY = sessionStorage.getItem("scrollPosition");
    if (savedScrollY) {
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedScrollY),
            behavior: "auto", // Instant scroll to avoid jarring effect
          });

          // Clean up the stored position
          sessionStorage.removeItem("scrollPosition");
        });
      });
    }
  }, [launchData]);

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-semibold text-white">
          Failed to load launches
        </h2>
        <p className="text-gray-400">{error}</p>
        <Button onClick={handleRetry} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  // No data state
  if (!launchData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-float" />
        <h2 className="text-2xl font-semibold text-white mb-2">
          No data available
        </h2>
        <p className="text-gray-400">Unable to load launch data</p>
      </div>
    );
  }

  const { docs: launches, totalDocs, hasNextPage } = launchData;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold gradient-text-hover">
            SpaceX Explorer
          </h1>
          <Sparkles
            className="w-8 h-8 text-blue-400 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Journey through the history of space exploration. Discover launches,
          rockets, and humanity&apos;s quest to reach the stars.
        </p>
      </div>

      <LaunchFilters filters={filters} onFiltersChange={handleFilterChange} />

      {/* Data Stats */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-400">
          <span>
            Showing {launches.length} of {totalDocs} launches
          </span>
          <span>
            {hasNextPage
              ? `${totalDocs - launches.length} more available`
              : "All results shown"}
          </span>
        </div>
      </div>

      {launches.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-float" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            No launches found
          </h2>
          <p className="text-gray-400">
            Try adjusting your filters to explore more missions
          </p>
        </div>
      ) : (
        <>
          {/* Launch Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launches.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div
              ref={observerTarget}
              className="h-20 flex items-center justify-center"
            >
              {isLoadingMore && (
                <div className="flex items-center space-x-3">
                  <div className="loading-spinner"></div>
                  <span className="text-gray-400">
                    Loading more launches...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* End message */}
          {!hasNextPage && launches.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You&apos;ve reached the edge of the universe
              </p>
            </div>
          )}

          {/* Manual Load More Button (fallback) */}
          {hasNextPage && !isLoadingMore && (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  // Store scroll position before manual load
                  const currentScrollY = window.scrollY;
                  sessionStorage.setItem(
                    "scrollPosition",
                    String(currentScrollY)
                  );
                  loadMoreData();
                }}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                Load More ({launches.length} of {totalDocs})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
