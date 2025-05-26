"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  GitHubUser,
  GitHubRepo,
  SearchRepoResponse,
  StarredItems,
  SearchHistory,
} from "./types";

const API_BASE = "http://localhost:8000/api";

// Enhanced fetch with error handling and CORS
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        // "Access-Control-Allow-Headers": "Content-Type, Authorization",
        ...options?.headers,
      },
      // mode: "cors",
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
      if (response.status === 404) {
        throw new Error("Resource not found");
      }
      if (response.status >= 400 && response.status < 500) {
        throw new Error("Bad request. Please check your input.");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your connection and ensure the server is running."
      );
    }
    throw error;
  }
}

// API Functions
async function fetchUser(username: string): Promise<GitHubUser> {
  return apiRequest<GitHubUser>(`${API_BASE}/user/${username}`);
}

async function fetchUserRepos(
  username: string,
  page = 1,
  limit = 10
): Promise<GitHubRepo[]> {
  return apiRequest<GitHubRepo[]>(
    `${API_BASE}/user-repos/${username}?page=${page}&limit=${limit}`
  );
}

async function fetchRepoReadme(owner: string, repo: string): Promise<string> {
  return apiRequest<string>(
    `${API_BASE}/repo/readme?owner=${owner}&repo=${repo}`
  );
}

async function searchRepos(
  query: string,
  page = 1,
  limit = 10
): Promise<SearchRepoResponse> {
  return apiRequest<SearchRepoResponse>(
    `${API_BASE}/search/repos?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );
}

async function starUser(username: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${API_BASE}/star/user`, {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

async function starRepo(fullName: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${API_BASE}/star/repo`, {
    method: "POST",
    body: JSON.stringify({ fullName }),
  });
}

async function fetchStarredItems(): Promise<StarredItems> {
  return apiRequest<StarredItems>(`${API_BASE}/stars`);
}

async function fetchSearchHistory(): Promise<SearchHistory> {
  return apiRequest<SearchHistory>(`${API_BASE}/history`);
}

// React Query Hooks
export function useUser(username: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username),
    enabled: !!username && options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useUserRepos(
  username: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["userRepos", username],
    queryFn: () => fetchUserRepos(username),
    enabled: !!username && options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useRepoReadme(
  owner: string,
  repo: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["readme", owner, repo],
    queryFn: () => fetchRepoReadme(owner, repo),
    enabled: !!owner && !!repo && options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useSearchUsers(
  username: string,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["searchUsers", username],
    queryFn: async () => {
      const user = await fetchUser(username);
      // Invalidate history after successful search
      queryClient.invalidateQueries({ queryKey: ["history"] });
      return [user];
    },
    enabled: !!username && options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useSearchRepos(
  query: string,
  page = 1,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["searchRepos", query, page],
    queryFn: async () => {
      const result = await searchRepos(query, page);
      // Invalidate history after successful search
      queryClient.invalidateQueries({ queryKey: ["history"] });
      return result;
    },
    enabled: !!query && options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useStarredItems() {
  return useQuery({
    queryKey: ["starred"],
    queryFn: fetchStarredItems,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useSearchHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchSearchHistory,
    enabled: options?.enabled !== false,
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useStarUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username }: { username: string }) => starUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred"] });
    },
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}

export function useStarRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fullName }: { fullName: string }) => starRepo(fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred"] });
    },
    retry: (failureCount, error) => {
      if (
        error.message.includes("Server error") ||
        error.message.includes("Network error")
      ) {
        return failureCount < 2;
      }
      return false;
    },
  });
}
