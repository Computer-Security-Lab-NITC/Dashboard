import {
  fallbackAnnouncements,
  fallbackArchives,
  fallbackConfig,
  fallbackTools,
  fallbackWinnersSummary,
} from "./fallbackData";
import type {
  Announcement,
  AppConfig,
  ArchiveEvent,
  CurrentYearResponse,
  Tool,
  WinnersSummary,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const FALLBACK_CURRENT_EVENT_YEAR = 2026;
let currentEventYearPromise: Promise<number> | undefined;

function yearPath(year: number, resource: string) {
  return `/api/${year}/${resource}`;
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.info(`Using fallback data for ${path}`, error);
    return fallback;
  }
}

export function getCurrentEventYear() {
  currentEventYearPromise ??= getJson<CurrentYearResponse>("/api/current-year", {
    year: FALLBACK_CURRENT_EVENT_YEAR,
  }).then((response) => response.year);

  return currentEventYearPromise;
}

async function getCurrentYearJson<T>(resource: string, fallback: T) {
  const year = await getCurrentEventYear();

  return getJson<T>(yearPath(year, resource), fallback);
}

export function getConfig() {
  return getCurrentYearJson<AppConfig>("config", fallbackConfig);
}

export function getAnnouncements() {
  return getJson<Announcement[]>("/api/announcements", fallbackAnnouncements);
}

export function getTools() {
  return getCurrentYearJson<Tool[]>("tools", fallbackTools);
}

export function getWinnersSummary() {
  return getCurrentYearJson<WinnersSummary>("winners", fallbackWinnersSummary);
}

export function getArchiveYears() {
  return getJson<number[]>("/api/archives/years", fallbackArchives.map((archive) => archive.year));
}

export function getArchiveByYear(year: number) {
  const fallback = fallbackArchives.find((archive) => archive.year === year) ?? fallbackArchives[0];

  return getJson<ArchiveEvent>(`/api/archives/${year}`, fallback);
}
