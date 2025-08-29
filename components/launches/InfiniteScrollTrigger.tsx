"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Filters } from "@/lib/api/types";

interface InfiniteScrollTriggerProps {
  filters: Filters;
  currentCount: number;
}

export function InfiniteScrollTrigger({
  filters,
  currentCount,
}: InfiniteScrollTriggerProps) {
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTriggeredCount, setLastTriggeredCount] = useState(currentCount);

  // Check if we should show persistent loading state across navigation
  useEffect(() => {
    const persistentLoading = sessionStorage.getItem("infiniteScrollLoading");
    if (persistentLoading === "true") {
      setIsLoading(true);
      // Clear it after component mounts
      sessionStorage.removeItem("infiniteScrollLoading");
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // Only trigger if:
        // 1. Element is visible
        // 2. Not currently loading
        // 3. Haven't triggered for this current count already
        if (
          entry.isIntersecting &&
          !isLoading &&
          currentCount !== lastTriggeredCount
        ) {
          setIsLoading(true);
          setLastTriggeredCount(currentCount);

          // Store loading state and scroll position
          sessionStorage.setItem("infiniteScrollLoading", "true");
          sessionStorage.setItem("scrollPosition", String(window.scrollY));

          // Increase limit to load more results
          const newLimit = filters.limit + 20;

          const params = new URLSearchParams();

          // Preserve all current filters
          if (filters.upcoming !== undefined) {
            params.set("upcoming", String(filters.upcoming));
          }
          if (filters.success !== undefined) {
            params.set("success", String(filters.success));
          }
          if (filters.dateRange?.start) {
            params.set("start", filters.dateRange.start.toISOString());
          }
          if (filters.dateRange?.end) {
            params.set("end", filters.dateRange.end.toISOString());
          }
          if (filters.search) {
            params.set("search", filters.search);
          }
          if (filters.sortBy !== "date") {
            params.set("sortBy", filters.sortBy);
          }
          if (filters.sortOrder !== "desc") {
            params.set("sortOrder", filters.sortOrder);
          }

          // Set new limit
          params.set("limit", String(newLimit));

          // Add scroll preservation flag
          params.set("preserveScroll", "true");

          const newUrl = `/?${params.toString()}`;

          // Use router.push to trigger server re-fetch
          router.push(newUrl, { scroll: false });
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading when 100px away from trigger
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [router, filters, isLoading, currentCount, lastTriggeredCount]);

  // Reset loading state when currentCount changes (new data loaded)
  useEffect(() => {
    if (currentCount > lastTriggeredCount) {
      setIsLoading(false);
      sessionStorage.removeItem("infiniteScrollLoading");
    }
  }, [currentCount, lastTriggeredCount]);

  return (
    <div ref={observerRef} className="h-10 flex items-center justify-center">
      {isLoading && (
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <span className="text-gray-400">Loading more launches...</span>
        </div>
      )}
    </div>
  );
}
