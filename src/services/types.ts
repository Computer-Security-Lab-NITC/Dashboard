export type AnnouncementTag = "info" | "hint" | "warning" | "danger";

export interface AppConfig {
  registrationOpen: boolean;
  googleFormUrl: string;
}

export interface CurrentYearResponse {
  year: number;
}

export interface YearInfo {
  id: string | number;
  documentId?: string;
  year: number;
  title: string;
  date: string;
  venue?: string;
  totalTeams?: number;
}

export interface YearDetail {
  id: string | number;
  documentId?: string;
  year: number;
  desc: string;
  regDeadline: string;
  eventStartTime: string;
  eventEndTime: string;
}

export interface Announcement {
  id: string | number;
  documentId?: string;
  title: string;
  body: string;
  tag: AnnouncementTag;
  timestamp: string;
}

export interface Tool {
  id: string | number;
  documentId?: string;
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
