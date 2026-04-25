# NullPointer CTF Dashboard Frontend

React + TypeScript frontend for the NullPointer CTF dashboard. The Flask app has been removed from this repo; the UI now expects a backend API and includes local fallback data so frontend development can continue before the backend is ready.

## API Contract

Set `VITE_API_BASE_URL` in `.env` to point at the backend. If it is omitted, requests are made relative to the same origin.

Expected endpoints:

- `GET /api/current-year`
- `GET /api/:year/config`
- `GET /api/announcements`
- `GET /api/:year/tools`
- `GET /api/:year/winners`
- `GET /api/archives/years`
- `GET /api/archives/:year`

Example responses:

```json
{
  "year": 2026
}
```

```json
{
  "registrationOpen": false,
  "googleFormUrl": "https://forms.gle/example"
}
```

```json
[
  {
    "id": 1,
    "title": "Registration is now LIVE!",
    "body": "Welcome to NullPointer!",
    "tag": "info",
    "timestamp": "08-04-2026 09:00"
  }
]
```

```json
[2025, 2024]
```

```json
{
  "year": 2025,
  "title": "NullPointer CTF 2025",
  "date": "18-04-2025",
  "venue": "SSL Labs, NIT Calicut",
  "totalTeams": 10,
  "description": "Short recap of how the event went.",
  "conductedBy": [
    {
      "name": "Ananya Menon",
      "type": "student",
      "githubUrl": "https://github.com/example",
      "linkedinUrl": "https://www.linkedin.com/in/example"
    },
    {
      "name": "Dr. Meera Krishnan",
      "type": "faculty",
      "linkedinUrl": "https://www.linkedin.com/in/example"
    }
  ],
  "winners": [
    {
      "rank": 1,
      "teamName": "Kernel Panic"
    },
    {
      "rank": 2,
      "teamName": "Cipher Squad"
    },
    {
      "rank": 3,
      "teamName": "Hex Hunters"
    }
  ],
  "levelProgress": [
    {
      "level": 0,
      "teamsCrossed": 10
    },
    {
      "level": 1,
      "teamsCrossed": 8
    }
  ],
  "highlights": [
    "Forensics and web challenges saw the highest number of solves.",
    "Prize distribution was conducted after the final scoreboard review."
  ],
  "photos": [
    {
      "id": 1,
      "url": "https://example.com/event-photo.jpg",
      "alt": "Participants solving challenges during NullPointer CTF 2025",
      "caption": "Teams during the contest window",
      "kind": "event"
    },
    {
      "id": 2,
      "url": "https://example.com/prize-photo.jpg",
      "alt": "Winning team receiving the prize",
      "caption": "Prize distribution",
      "kind": "prize"
    }
  ]
}
```

```json
{
  "totalTeams": 12,
  "winners": [
    {
      "rank": 1,
      "teamName": "Segfault Syndicate",
      "photoUrl": "https://example.com/team-photo.jpg"
    },
    {
      "rank": 2,
      "teamName": "Packet Pirates"
    },
    {
      "rank": 3,
      "teamName": "Root Cause"
    }
  ],
  "levelProgress": [
    {
      "level": 0,
      "teamsCrossed": 12
    },
    {
      "level": 1,
      "teamsCrossed": 10
    }
  ]
}
```

The frontend asks `GET /api/current-year` for the active CTF year and then calls year-scoped endpoints such as `GET /api/:year/config`, `GET /api/:year/tools`, and `GET /api/:year/winners`. Archives use `GET /api/archives/years` for the edition picker and `GET /api/archives/:year` for post-event details. Updates remain separate at `GET /api/announcements`.

```json
[
  {
    "id": 1,
    "name": "Ghidra",
    "url": "https://ghidra-sre.org/",
    "description": "NSA's open-source reverse engineering framework.",
    "category": "Reverse Engineering"
  }
]
```

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env` if your backend runs somewhere other than `http://localhost:4000`.

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

The generated static files are written to `dist/`.
