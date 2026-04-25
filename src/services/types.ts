export type AnnouncementTag = "info" | "hint" | "warning" | "danger";

export interface AppConfig {
  registrationOpen: boolean;
  googleFormUrl: string;
}

export interface CurrentYearResponse {
  year: number;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  tag: AnnouncementTag;
  timestamp: string;
}

export interface Tool {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
}

export interface WinningTeam {
  rank: 1 | 2 | 3;
  teamName: string;
  photoUrl?: string;
}

export interface LevelProgress {
  level: number;
  teamsCrossed: number;
}

export interface WinnersSummary {
  totalTeams: number;
  winners: WinningTeam[];
  levelProgress: LevelProgress[];
}

export interface ArchivePhoto {
  id: number;
  url: string;
  alt: string;
  caption?: string;
  kind: "event" | "prize" | "team";
}

export interface ArchiveConductedBy {
  name: string;
  type: "student" | "faculty";
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ArchiveEvent {
  year: number;
  title: string;
  date: string;
  venue?: string;
  totalTeams?: number;
  conductedBy: ArchiveConductedBy[];
  winners: WinningTeam[];
  levelProgress: LevelProgress[];
  description: string;
  highlights: string[];
  photos?: ArchivePhoto[];
}
