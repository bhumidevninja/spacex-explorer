import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { spacexAPI } from "@/lib/api/spacex";
import { LaunchQuery } from "@/lib/api/types";

interface UseLaunchesParams {
  upcoming?: boolean;
  success?: boolean;
  dateRange?: { start?: Date; end?: Date };
  search?: string;
  sortBy?: "date" | "name";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export function useLaunches({
  upcoming,
  success,
  dateRange,
  search,
  sortBy = "date",
  sortOrder = "desc",
  limit = 20,
}: UseLaunchesParams) {
  const buildQuery = (offset: number): LaunchQuery => {
    const query: LaunchQuery = {
      query: {},
      options: {
        limit,
        offset,
        sort: {},
      },
    };

    if (upcoming !== undefined) {
      query.query!.upcoming = upcoming;
    }

    if (success !== undefined) {
      query.query!.success = success;
    }

    if (dateRange?.start || dateRange?.end) {
      query.query!.date_utc = {};
      if (dateRange.start) {
        query.query!.date_utc.$gte = dateRange.start.toISOString();
      }
      if (dateRange.end) {
        query.query!.date_utc.$lte = dateRange.end.toISOString();
      }
    }

    if (search) {
      query.query!.name = {
        $regex: search,
        $options: "i",
      };
    }

    const sortField = sortBy === "date" ? "date_unix" : "name";
    query.options!.sort![sortField] = sortOrder === "asc" ? 1 : -1;

    return query;
  };

  return useInfiniteQuery({
    queryKey: [
      "launches",
      { upcoming, success, dateRange, search, sortBy, sortOrder, limit },
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const query = buildQuery(pageParam);
      return spacexAPI.queryLaunches(query);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length * limit;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
}

export function useLaunch(id: string) {
  return useQuery({
    queryKey: ["launch", id],
    queryFn: () => spacexAPI.getLaunch(id),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
  });
}

export function useRocket(id: string) {
  return useQuery({
    queryKey: ["rocket", id],
    queryFn: () => spacexAPI.getRocket(id),
    enabled: !!id,
    staleTime: 3600000, // 1 hour - rockets don't change often
  });
}

export function useLaunchpad(id: string) {
  return useQuery({
    queryKey: ["launchpad", id],
    queryFn: () => spacexAPI.getLaunchpad(id),
    enabled: !!id,
    staleTime: 3600000, // 1 hour
  });
}
