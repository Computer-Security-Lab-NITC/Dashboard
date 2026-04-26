import {
  fallbackAnnouncements,
  fallbackArchives,
  fallbackConfig,
  fallbackCurrentYearDetail,
  fallbackCurrentYear,
  fallbackTools,
  fallbackWinnersSummary,
} from "./fallbackData";
import type { Announcement, AppConfig, ArchiveEvent, Tool, WinnersSummary, YearDetail, YearInfo } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:1337";
const DEFAULT_STRING = "default deafault";

console.log("[API] base URL:", API_BASE_URL);

type StrapiEntity<T> = {
  id: number | string;
  documentId?: string;
  attributes?: T;
};

type StrapiCollectionResponse<T> = {
  data: StrapiEntity<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

type StrapiSingleResponse<T> = {
  data: StrapiEntity<T> | null;
};

type StrapiResponse<T> = StrapiCollectionResponse<T> | StrapiSingleResponse<T>;

function isCollectionResponse<T>(response: StrapiResponse<T>): response is StrapiCollectionResponse<T> {
  return Array.isArray((response as any).data);
}

function normalizeStrapiResponse<T>(response: StrapiResponse<T>) {
  if (isCollectionResponse(response)) {
    return response;
  }

  return {
    data: response.data ? [response.data] : [],
  } as StrapiCollectionResponse<T>;
}

function parseStrapiEntity<T>(entity: StrapiEntity<T>): T & { id: string | number; documentId?: string } {
  const base = {
    id: normalizeId(entity.id),
    documentId: entity.documentId,
  };

  if (entity.attributes) {
    return { ...base, ...entity.attributes } as T & { id: string | number; documentId?: string };
  }

  const { attributes, ...direct } = entity as unknown as T & { attributes?: T };
  return { ...base, ...direct } as T & { id: string | number; documentId?: string };
}

async function getJson<T>(path: string, fallback: T, onFallback?: () => void): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log("[API] fetching", url);

  try {
    const response = await fetch(url);
    console.log("[API] response", response.status, response.url);

    if (!response.ok) {
      const text = await response.text();
      console.error("[API] non-ok response", response.status, response.statusText, text);
      throw new Error(`Request failed with ${response.status}`);
    }

    const json = (await response.json()) as T;
    console.log("[API] success", url, json);
    return json;
  } catch (error) {
    console.error(`[API] request failed ${url}`, error);
    onFallback?.();
    console.info(`Using fallback data for ${path}`);
    return fallback;
  }
}

function normalizeId(id: number | string) {
  const parsed = typeof id === "number" ? id : Number(id);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseStrapiCollection<T>(response: StrapiResponse<T>) {
  const normalized = normalizeStrapiResponse(response);

  if (!normalized?.data || !Array.isArray(normalized.data)) {
    return [] as Array<T & { id: string | number; documentId?: string }>;
  }

  return normalized.data.map(parseStrapiEntity);
}

function parseStrapiSingle<T>(response: StrapiResponse<T>) {
  const normalized = normalizeStrapiResponse(response);

  if (!normalized.data.length) {
    return null;
  }

  return parseStrapiEntity(normalized.data[0]);
}

function parseRelationCollection<T>(relation?: { data?: StrapiEntity<T>[] } | StrapiEntity<T>[]) {
  if (Array.isArray(relation)) {
    return relation.map(parseStrapiEntity);
  }

  if (!relation?.data || !Array.isArray(relation.data)) {
    return [] as Array<T & { id: string | number; documentId?: string }>;
  }

  return relation.data.map(parseStrapiEntity);
}

function parseRelationEntity<T>(relation?: { data?: StrapiEntity<T> } | StrapiEntity<T> | null) {
  if (!relation) {
    return null;
  }

  if ("id" in relation) {
    return parseStrapiEntity(relation as StrapiEntity<T>);
  }

  if (relation.data) {
    return parseStrapiEntity(relation.data);
  }

  return null;
}

function normalizeString(value?: string) {
  return value && value.trim() !== "" ? value : DEFAULT_STRING;
}

function normalizeOptionalString(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function normalizeRichText(value?: unknown): string {
  if (!value) {
    return DEFAULT_STRING;
  }

  if (typeof value === "string") {
    return normalizeString(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((node) => {
        if (typeof node === "string") {
          return node;
        }

        if (typeof node === "object" && node !== null) {
          return normalizeRichText((node as any).children || (node as any).text);
        }

        return "";
      })
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.text === "string") {
      return normalizeString(obj.text);
    }

    return normalizeRichText(obj.children || obj.text);
  }

  return DEFAULT_STRING;
}

function parseHighlights(value?: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const highlights: string[] = [];

  for (const block of value) {
    if (block && typeof block === "object" && "type" in block) {
      const type = (block as any).type;

      if (type === "list" || type === "numbered-list") {
        const children = (block as any).children;

        if (Array.isArray(children)) {
          for (const item of children) {
            const text = normalizeRichText(item);
            if (text !== DEFAULT_STRING) {
              highlights.push(text);
            }
          }
          continue;
        }
      }
    }

    const text = normalizeRichText(block);
    if (text !== DEFAULT_STRING) {
      highlights.push(text);
    }
  }

  return highlights;
}

function mapYearInfo(entry: (StrapiYearAttributes & { id: string | number; documentId?: string }) | null): YearInfo {
  if (!entry) {
    return fallbackCurrentYear;
  }

  return {
    id: entry.id,
    documentId: entry.documentId,
    year: entry.year ?? 0,
    title: normalizeString(entry.title),
    date: normalizeString(entry.event_date ?? entry.date),
    venue: normalizeString(entry.venue),
    totalTeams: entry.total_teams ?? 0,
  };
}

function mapYearDetail(entry: (StrapiYearDetailAttributes & { id: string | number; documentId?: string }) | null): YearDetail {
  if (!entry) {
    return fallbackCurrentYearDetail;
  }

  const yearEntity = parseRelationEntity(entry.year);

  return {
    id: entry.id,
    documentId: entry.documentId,
    year: yearEntity?.year ?? 0,
    desc: normalizeRichText(entry.desc ?? entry.description),
    regDeadline: normalizeString(entry.reg_deadline),
    eventStartTime: normalizeString(entry.event_start_time),
    eventEndTime: normalizeString(entry.event_end_time),
  };
}

type StrapiArchivePhoto = {
  url?: string;
  alt?: string;
  caption?: string;
  kind?: string;
};

interface StrapiYearAttributes {
  year?: number;
  title?: string;
  date?: string;
  event_date?: string;
  event_desc?: unknown;
  event_data?: unknown;
  archive?: boolean;
  total_teams?: number;
  venue?: string;
  highlights?: unknown;
  curr_year?: boolean;
  conducted_by?: { data?: StrapiEntity<ArchiveEvent["conductedBy"][number]>[] };
  teams?: { data?: StrapiEntity<{ name?: string; rank?: number }>[] };
  levels?: { data?: StrapiEntity<{ number?: number; teams_crossed?: number }>[] };
  photos?: { data?: StrapiEntity<StrapiArchivePhoto>[] };
}

interface StrapiYearDetailAttributes {
  description?: unknown;
  desc?: unknown;
  year?: { data?: StrapiEntity<{ documentId?: string; year?: number; curr_year?: boolean }> };
  reg_deadline?: string;
  event_start_time?: string;
  event_end_time?: string;
}

export function getConfig(onFallback?: () => void) {
  return getJson<StrapiSingleResponse<{ curr_year?: number; reg_open?: boolean; google_form_url?: string; registrationOpen?: boolean; googleFormUrl?: string }>>(
    "/api/config",
    { data: null },
    onFallback,
  ).then((response) => {
    const attributes = parseStrapiSingle(response);

    return {
      registrationOpen: attributes?.reg_open ?? attributes?.registrationOpen ?? false,
      googleFormUrl: normalizeString(attributes?.google_form_url ?? attributes?.googleFormUrl),
    } as AppConfig;
  });
}

export function getCurrentYear(onFallback?: () => void) {
  return getJson<StrapiResponse<StrapiYearAttributes>>(
    "/api/years?filters[curr_year][$eq]=true&populate=*",
    { data: [] },
    onFallback,
  ).then((response) => {
    const firstEntry = parseStrapiSingle(response);
    return mapYearInfo(firstEntry);
  });
}

export async function getCurrentYearDetailByYearDocumentId(yearDocumentId: string | undefined, onFallback?: () => void) {
  if (!yearDocumentId) {
    console.warn("[API] getCurrentYearDetailByYearDocumentId skipped because yearDocumentId is missing");
    onFallback?.();
    return fallbackCurrentYearDetail;
  }

  const response = await getJson<StrapiResponse<StrapiYearDetailAttributes>>(
    `/api/year-details?populate=*&filters[year][documentId][$eq]=${encodeURIComponent(yearDocumentId)}`,
    { data: [] },
    onFallback,
  );

  const firstEntry = parseStrapiSingle(response);

  if (!firstEntry) {
    console.warn("[API] no year-details entry found for year documentId", yearDocumentId);
    return fallbackCurrentYearDetail;
  }

  return mapYearDetail(firstEntry);
}

export async function getCurrentYearWithDetails(onFallback?: () => void) {
  const currentYearResponse = await getJson<StrapiResponse<StrapiYearAttributes>>(
    "/api/years?filters[curr_year][$eq]=true&populate=*",
    { data: [] },
    onFallback,
  );

  let yearEntry = parseStrapiSingle(currentYearResponse);

  if (!yearEntry) {
    console.warn("[API] no current-year entry found; falling back to latest year record");
    const latestYearResponse = await getJson<StrapiResponse<StrapiYearAttributes>>(
      "/api/years?sort=year:desc&populate=*",
      { data: [] },
      onFallback,
    );
    yearEntry = parseStrapiSingle(latestYearResponse);
  }

  const yearInfo = mapYearInfo(yearEntry);
  const yearDetail = await getCurrentYearDetailByYearDocumentId(yearEntry?.documentId, onFallback);

  return {
    yearInfo,
    yearDetail,
  };
}

export async function getCurrentYearDetail(year: number, onFallback?: () => void) {
  if (year <= 0) {
    console.warn("[API] getCurrentYearDetail skipped for invalid year", year);
    onFallback?.();
    return fallbackCurrentYearDetail;
  }

  const currentYearResponse = await getJson<StrapiResponse<StrapiYearAttributes>>(
    `/api/years?filters[year][$eq]=${year}&populate=*`,
    { data: [] },
    onFallback,
  );

  const yearEntry = parseStrapiSingle(currentYearResponse);
  return getCurrentYearDetailByYearDocumentId(yearEntry?.documentId, onFallback);
}

export function getAnnouncements(onFallback?: () => void) {
  return getJson<StrapiCollectionResponse<Omit<Announcement, "id">>>(
    "/api/announcements?sort=timestamp:desc",
    { data: [] },
    onFallback,
  ).then((response) =>
    parseStrapiCollection(response).map((announcement) => ({
      id: announcement.id,
      title: normalizeString(announcement.title),
      body: normalizeString(announcement.body),
      tag: announcement.tag ?? "info",
      timestamp: normalizeString(announcement.timestamp),
    })),
  );
}

export function getTools(onFallback?: () => void) {
  return getJson<StrapiCollectionResponse<{ name?: string; url?: string; desc?: string; category?: string }>>(
    "/api/tools?sort=category:asc",
    { data: [] },
    onFallback,
  ).then((response) =>
    parseStrapiCollection(response).map((tool) => ({
      id: tool.id,
      name: normalizeString(tool.name),
      url: normalizeString(tool.url),
      description: normalizeString(tool.desc),
      category: normalizeString(tool.category),
    })),
  );
}

export function getWinnersSummary(onFallback?: () => void) {
  return getJson<StrapiCollectionResponse<StrapiYearAttributes>>(
    "/api/years?filters[curr_year][$eq]=true&populate=*",
    { data: [] },
    onFallback,
  ).then((response) => {
    const currentYear = parseStrapiSingle(response);

    if (!currentYear) {
      return fallbackWinnersSummary;
    }

    const teams = parseRelationCollection(currentYear.teams)
      .filter((team) => typeof team.rank === "number")
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

    const levelProgress = parseRelationCollection(currentYear.levels).map((level) => ({
      level: level.number ?? 0,
      teamsCrossed: level.teams_crossed ?? 0,
    }));

    const winners = teams
      .filter((team) => [1, 2, 3].includes(team.rank ?? 0))
      .slice(0, 3)
      .map((team) => ({
        rank: team.rank as 1 | 2 | 3,
        teamName: normalizeString(team.name),
      }));

    return {
      totalTeams: currentYear.total_teams ?? fallbackWinnersSummary.totalTeams,
      winners: winners.length > 0 ? winners : fallbackWinnersSummary.winners,
      levelProgress: levelProgress.length > 0 ? levelProgress : fallbackWinnersSummary.levelProgress,
    };
  });
}

export function getArchiveYears(onFallback?: () => void) {
  return getJson<StrapiCollectionResponse<{ year?: number }>>(
    "/api/years?filters[archive][$eq]=true&sort=year:desc&fields[0]=year",
    { data: [] },
    onFallback,
  ).then((response) => {
    const years = parseStrapiCollection(response).map((year) => year.year ?? 0).filter((value) => value > 0);

    return years.length > 0 ? years : fallbackArchives.map((archive) => archive.year);
  });
}

export function getArchiveByYear(year: number, onFallback?: () => void) {
  const fallback = fallbackArchives.find((archive) => archive.year === year) ?? fallbackArchives[0];

  return getJson<StrapiCollectionResponse<StrapiYearAttributes>>(
    `/api/years?filters[year][$eq]=${year}&populate=*`,
    { data: [] },
    onFallback,
  ).then((response) => {
    const yearData = parseStrapiSingle(response);

    if (!yearData) {
      return fallback;
    }

    const conductedBy = parseRelationCollection(yearData.conducted_by).map((person) => ({
      name: normalizeString(person.name),
      type: person.type ?? "student",
      githubUrl: normalizeOptionalString(person.githubUrl ?? (person as any).github_url),
      linkedinUrl: normalizeOptionalString(person.linkedinUrl ?? (person as any).linkedin_url),
    }));

    const winners = parseRelationCollection(yearData.teams)
      .filter((team) => typeof team.rank === "number" && team.rank >= 1 && team.rank <= 3)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
      .map((team) => ({
        rank: team.rank ?? 0,
        teamName: normalizeString(team.name),
      }));

    const levelProgress = parseRelationCollection(yearData.levels).map((level) => ({
      level: level.number ?? 0,
      teamsCrossed: level.teams_crossed ?? 0,
    }));

    const photos = parseRelationCollection(yearData.photos).map((photo) => ({
      id: photo.id,
      url: normalizeString(photo.url),
      alt: normalizeString(photo.alt),
      caption: photo.caption,
      kind: photo.kind ?? "event",
    }));

    return {
      year: yearData.year ?? year,
      title: normalizeString(yearData.title ?? `NullPointer CTF ${year}`),
      date: normalizeString(yearData.event_date ?? yearData.date),
      venue: yearData.venue,
      totalTeams: yearData.total_teams,
      conductedBy,
      winners: winners.length > 0 ? winners : fallbackWinnersSummary.winners,
      levelProgress: levelProgress.length > 0 ? levelProgress : fallbackWinnersSummary.levelProgress,
      description: normalizeRichText(yearData.event_desc ?? yearData.event_data),
      highlights: parseHighlights(yearData.highlights),
      photos,
    } as ArchiveEvent;
  });
}
