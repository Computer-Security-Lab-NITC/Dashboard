import type { Announcement, AppConfig, ArchiveEvent, CurrentYearResponse, Tool, WinnersSummary, YearDetail, YearInfo } from "./types";

export const fallbackConfig: AppConfig = {
  registrationOpen: false,
  googleFormUrl: "#",
};

export const fallbackCurrentYear: YearInfo = {
  id: 0,
  year: 0,
  title: "default deafault",
  date: "default deafault",
  venue: "default deafault",
  totalTeams: 0,
};

export const fallbackCurrentYearDetail: YearDetail = {
  id: 0,
  year: 0,
  desc: "default deafault",
  regDeadline: "default deafault",
  eventStartTime: "default deafault",
  eventEndTime: "default deafault",
};

export const fallbackAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Registration is now LIVE!",
    body: "Welcome to NullPointer! Registration is now open. Please sign up using the Google Form linked on the homepage. We can't wait to see you compete!",
    tag: "info",
    timestamp: "08-04-2026 09:00",
  },
  {
    id: 2,
    title: "Registration is closed!",
    body: "Due to slots being full, we have decided to close the registration form earlier than the deadline. Thank you for your interest.",
    tag: "info",
    timestamp: "10-04-2026 12:00",
  },
];

export const fallbackTools: Tool[] = [
  {
    id: 1,
    name: "Ghidra",
    url: "https://ghidra-sre.org/",
    description: "NSA's open-source reverse engineering framework with a powerful decompiler.",
    category: "Reverse Engineering",
  },
  {
    id: 2,
    name: "Wireshark",
    url: "https://www.wireshark.org/",
    description: "Network protocol analyzer for capturing and inspecting packets.",
    category: "Forensics",
  },
  {
    id: 3,
    name: "ZAP Proxy",
    url: "https://www.zaproxy.org/",
    description: "OWASP's Zed Attack Proxy for finding vulnerabilities in web applications.",
    category: "Web",
  },
  {
    id: 5,
    name: "steghide",
    url: "https://steghide.sourceforge.net/",
    description: "Tool for hiding and extracting data inside images and audio files using steganography.",
    category: "Forensics",
  },
];

export const fallbackWinnersSummary: WinnersSummary = {
  totalTeams: 12,
  winners: [
    {
      rank: 1,
      teamName: "Segfault Syndicate",
    },
    {
      rank: 2,
      teamName: "Packet Pirates",
    },
    {
      rank: 3,
      teamName: "Root Cause",
    },
  ],
  levelProgress: [
    { level: 0, teamsCrossed: 12 },
    { level: 1, teamsCrossed: 10 },
    { level: 2, teamsCrossed: 7 },
    { level: 3, teamsCrossed: 4 },
    { level: 4, teamsCrossed: 2 },
  ],
};

export const fallbackArchives: ArchiveEvent[] = [
  {
    year: 2025,
    title: "NullPointer CTF 2025",
    date: "18-04-2025",
    venue: "SSL Labs, NIT Calicut",
    totalTeams: 10,
    conductedBy: [
      {
        name: "Ananya Menon",
        type: "student",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        name: "Rohit Nair",
        type: "student",
        githubUrl: "https://github.com/",
      },
      {
        name: "Dr. Meera Krishnan",
        type: "faculty",
        linkedinUrl: "https://www.linkedin.com/",
      },
    ],
    description:
      "The 2025 edition brought together teams across beginner and intermediate tracks, with challenges focused on web exploitation, forensics, cryptography, and reverse engineering. The event ran as a compact in-person contest with strong participation and an energetic final scoreboard push.",
    winners: [
      { rank: 1, teamName: "Kernel Panic" },
      { rank: 2, teamName: "Cipher Squad" },
      { rank: 3, teamName: "Hex Hunters" },
    ],
    levelProgress: [
      { level: 0, teamsCrossed: 10 },
      { level: 1, teamsCrossed: 8 },
      { level: 2, teamsCrossed: 6 },
      { level: 3, teamsCrossed: 3 },
      { level: 4, teamsCrossed: 1 },
    ],
    highlights: [
      "Beginner-friendly opening challenges helped first-time players get on the scoreboard early.",
      "Forensics and web challenges saw the highest number of solves.",
      "Prize distribution was conducted after the final scoreboard review.",
    ],
    photos: [],
  },
  {
    year: 2024,
    title: "NullPointer CTF 2024",
    date: "19-04-2024",
    venue: "NIT Calicut",
    totalTeams: 8,
    conductedBy: [
      {
        name: "Arjun Ravi",
        type: "student",
        githubUrl: "https://github.com/",
      },
      {
        name: "Devika S",
        type: "student",
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        name: "Dr. Suresh Kumar",
        type: "faculty",
      },
    ],
    description:
      "The 2024 edition focused on building CTF interest inside the campus community. Teams worked through fundamentals-heavy challenges, and the event helped introduce participants to practical cybersecurity workflows.",
    winners: [
      { rank: 1, teamName: "Stack Smashers" },
      { rank: 2, teamName: "Shell Seekers" },
      { rank: 3, teamName: "Bit Breakers" },
    ],
    levelProgress: [
      { level: 0, teamsCrossed: 8 },
      { level: 1, teamsCrossed: 6 },
      { level: 2, teamsCrossed: 4 },
      { level: 3, teamsCrossed: 2 },
      { level: 4, teamsCrossed: 1 },
    ],
    highlights: [
      "Several teams solved their first CTF challenge during the event.",
      "The challenge set prioritized learning value and tool familiarity.",
      "The event closed with a walkthrough discussion for selected challenges.",
    ],
    photos: [],
  },
];
