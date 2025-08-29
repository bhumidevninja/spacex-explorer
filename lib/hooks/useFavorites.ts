import { useState, useEffect, useCallback } from "react";
import { spacexAPI } from "@/lib/api/spacex";
import { useQuery } from "@tanstack/react-query";

const FAVORITES_KEY = "spacex-favorites";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        setFavoriteIds(new Set(ids));
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((ids: Set<string>) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(ids)));
    setFavoriteIds(ids);
  }, []);

  const toggleFavorite = useCallback(
    (launchId: string) => {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(launchId)) {
          newSet.delete(launchId);
        } else {
          newSet.add(launchId);
        }
        saveFavorites(newSet);
        return newSet;
      });
    },
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (launchId: string) => {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(launchId);
        saveFavorites(newSet);
        return newSet;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (launchId: string) => {
      return favoriteIds.has(launchId);
    },
    [favoriteIds]
  );

  return {
    favoriteIds: Array.from(favoriteIds),
    toggleFavorite,
    removeFavorite,
    isFavorite,
    favoriteCount: favoriteIds.size,
  };
}

export function useFavoriteLaunches() {
  const { favoriteIds } = useFavorites();

  return useQuery({
    queryKey: ["favorites", favoriteIds],
    queryFn: () => spacexAPI.getLaunches(favoriteIds),
    enabled: favoriteIds.length > 0,
    staleTime: 60000,
  });
}
