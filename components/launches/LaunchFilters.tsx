"use client";

import { useState, useCallback } from "react";
import { Filters } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, XIcon } from "lucide-react";

interface LaunchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function LaunchFilters({
  filters,
  onFiltersChange,
}: LaunchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = useCallback(
    (key: keyof Filters, value: any) => {
      const newFilters = { ...filters, [key]: value };
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters: Filters = {
      upcoming: undefined,
      success: undefined,
      dateRange: undefined,
      search: "",
      sortBy: "date",
      sortOrder: "desc",
      limit: 20,
    };
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  const activeFilterCount = [
    filters.upcoming !== undefined,
    filters.success !== undefined,
    filters.dateRange !== undefined,
    filters.search !== "",
    filters.sortBy !== "date",
    filters.sortOrder !== "desc",
  ].filter(Boolean).length;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FilterIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-400 hover:text-white"
            >
              <XIcon className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-purple-400 hover:text-purple-300"
          >
            {isOpen ? "Hide" : "Show"} Filters
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <Input
              placeholder="Launch name..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("search", e.currentTarget.value);
                }
              }}
              className="bg-gray-800/50 border-gray-700"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <Select
              value={
                filters.upcoming === undefined
                  ? "all"
                  : filters.upcoming
                  ? "upcoming"
                  : "completed"
              }
              onValueChange={(value) =>
                updateFilter(
                  "upcoming",
                  value === "all" ? undefined : value === "upcoming"
                )
              }
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Launches</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Success */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Success
            </label>
            <Select
              value={
                filters.success === undefined
                  ? "all"
                  : filters.success
                  ? "success"
                  : "failure"
              }
              onValueChange={(value) =>
                updateFilter(
                  "success",
                  value === "all" ? undefined : value === "success"
                )
              }
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="failure">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value: "date" | "name") =>
                  updateFilter("sortBy", value)
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: "asc" | "desc") =>
                  updateFilter("sortOrder", value)
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">↓</SelectItem>
                  <SelectItem value="asc">↑</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
