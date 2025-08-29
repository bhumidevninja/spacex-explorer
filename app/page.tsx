import { getLaunches } from "@/lib/server/launches";
import HomePage from "@/components/pages/home";
import { Filters, LaunchResponse } from "@/lib/api/types";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function normalizeFilters(
  searchParams: Record<string, string | string[] | undefined>
): Filters {
  return {
    upcoming: searchParams.upcoming
      ? searchParams.upcoming === "true"
      : undefined,
    success: searchParams.success ? searchParams.success === "true" : undefined,
    dateRange:
      searchParams.start || searchParams.end
        ? {
            start: searchParams.start
              ? new Date(searchParams.start as string)
              : undefined,
            end: searchParams.end
              ? new Date(searchParams.end as string)
              : undefined,
          }
        : undefined,
    search: (searchParams.search as string) || "",
    sortBy: (searchParams.sortBy as "date" | "name") || "date",
    sortOrder: (searchParams.sortOrder as "asc" | "desc") || "desc",
    limit: searchParams.limit ? Number(searchParams.limit) : 20,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = normalizeFilters(params);

  let launchData: LaunchResponse | null = null;
  let error: string | null = null;

  try {
    // Fetch data on server with current filters and limit
    launchData = await getLaunches({
      ...filters,
      offset: 0,
    });
  } catch (err) {
    console.error("❌ Error fetching launches on server:", err);
    error = err instanceof Error ? err.message : "Failed to fetch launches";
  }

  return <HomePage filters={filters} launchData={launchData} error={error} />;
}
