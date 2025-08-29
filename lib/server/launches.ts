import { cache } from "react";
import { Filters, LaunchResponse } from "@/lib/api/types";

interface SpaceXQueryParams {
  upcoming?: boolean;
  success?: boolean;
  date_utc?: {
    $gte?: string;
    $lte?: string;
  };
  name?: {
    $regex: string;
    $options: string;
  };
}

interface SpaceXOptions {
  sort?: Record<string, 1 | -1>;
  limit?: number;
  offset?: number;
  populate?: string[];
}

export const getLaunches = cache(
  async (filters: Filters): Promise<LaunchResponse> => {
    try {
      const query: SpaceXQueryParams = {};
      const options: SpaceXOptions = {
        sort: {},
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        populate: ["rocket", "launchpad"],
      };

      // Apply filters to query
      if (filters.upcoming !== undefined) {
        query.upcoming = filters.upcoming;
      }

      if (filters.success !== undefined) {
        query.success = filters.success;
      }

      // Date range filtering
      if (filters.dateRange) {
        query.date_utc = {};
        if (filters.dateRange.start) {
          query.date_utc.$gte = filters.dateRange.start.toISOString();
        }
        if (filters.dateRange.end) {
          query.date_utc.$lte = filters.dateRange.end.toISOString();
        }
      }

      // Text search
      if (filters.search && filters.search.trim()) {
        query.name = {
          $regex: filters.search.trim(),
          $options: "i",
        };
      }

      // Sorting
      const sortField = filters.sortBy === "name" ? "name" : "date_utc";
      const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
      options.sort = { [sortField]: sortOrder };

      const requestBody = { query, options };

      const response = await fetch(
        "https://api.spacexdata.com/v4/launches/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          next: {
            revalidate: filters.upcoming ? 300 : 3600,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ SpaceX API Error:", response.status, errorText);
        throw new Error(
          `SpaceX API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        docs: data.docs || [],
        totalDocs: data.totalDocs || 0,
        limit: data.limit || filters.limit || 20,
        offset: data.offset || filters.offset || 0,
        totalPages: data.totalPages || 0,
        page: data.page || 1,
        pagingCounter: data.pagingCounter || 1,
        hasNextPage: data.hasNextPage || false,
        hasPrevPage: data.hasPrevPage || false,
        prevPage: data.prevPage || null,
        nextPage: data.nextPage || null,
      };
    } catch (error) {
      console.error("💥 Error in getLaunches:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to fetch launches: ${error.message}`
          : "Failed to fetch launches: Unknown error"
      );
    }
  }
);
