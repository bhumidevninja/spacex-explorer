import {
  Launch,
  LaunchQuery,
  LaunchQueryResponse,
  Rocket,
  Launchpad,
} from "./types";

const API_BASE = "https://api.spacexdata.com/v4";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class SpaceXAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "SpaceXAPIError";
  }
}

async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.status === 429 || response.status >= 500) {
      if (retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
        );
        return fetchWithRetry<T>(url, options, retries - 1);
      }
    }

    if (!response.ok) {
      throw new SpaceXAPIError(
        response.status,
        `API request failed: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof SpaceXAPIError) throw error;
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw error;
  }
}

export const spacexAPI = {
  async queryLaunches(query: LaunchQuery): Promise<LaunchQueryResponse> {
    return fetchWithRetry<LaunchQueryResponse>(`${API_BASE}/launches/query`, {
      method: "POST",
      body: JSON.stringify(query),
    });
  },

  async getLaunch(id: string): Promise<Launch> {
    return fetchWithRetry<Launch>(`${API_BASE}/launches/${id}`);
  },

  async getRocket(id: string): Promise<Rocket> {
    return fetchWithRetry<Rocket>(`${API_BASE}/rockets/${id}`);
  },

  async getLaunchpad(id: string): Promise<Launchpad> {
    return fetchWithRetry<Launchpad>(`${API_BASE}/launchpads/${id}`);
  },

  async getLaunches(ids: string[]): Promise<Launch[]> {
    if (ids.length === 0) return [];

    const response = await fetchWithRetry<{ docs: Launch[] }>(
      `${API_BASE}/launches/query`,
      {
        method: "POST",
        body: JSON.stringify({
          query: { _id: { $in: ids } },
          options: { limit: ids.length },
        }),
      }
    );

    return response.docs;
  },
};
