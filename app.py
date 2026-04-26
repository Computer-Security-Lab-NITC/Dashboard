import os

from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "defaultsecret")  # Replace with a secure random key in production

# In-memory store (replace with a DB for production)
announcements = [
    {
        "id": 1,
        "title": "Registration is now LIVE!",
        "body": "Welcome to Nullpointer! Registration is now open. Please sign up using the Google Form linked on the homepage. We can't wait to see you compete!",
        "tag": "info",
        "timestamp": "08-04-2026 09:00"
    },
    {
        "id": 2,
        "title": "Registration is closed!",
        "body": "Due to slots being full, we have decided to close the registration form earlier than the deadline. Thank you for your interest.",
        "tag": "info",
        "timestamp": "10-04-2026 12:00"
    },
    {
        "id": 3,
        "title": "Winners Announced!",
        "body": "Congratulations to all the winners of Nullpointer 2026! Check out the winners page for details. We will share the prize distribution date soon.",
        "tag": "info",
        "timestamp": "26-04-2026 18:00"
    }
]

tools = [
    {
        "id": 1,
        "name": "Ghidra",
        "url": "https://ghidra-sre.org/",
        "description": "NSA's open-source reverse engineering framework with a powerful decompiler.",
        "category": "Reverse Engineering"
    },
    {
        "id": 2,
        "name": "Wireshark",
        "url": "https://www.wireshark.org/",
        "description": "Network protocol analyzer for capturing and inspecting packets.",
        "category": "Forensics"
    },
    {
        "id": 3,
        "name": "ZAP Proxy",
        "url": "https://www.zaproxy.org/",
        "description": "OWASP's Zed Attack Proxy for finding vulnerabilities in web applications.",
        "category": "Web"
    },
    {
        "id": 5,
        "name": "steghide",
        "url": "https://steghide.sourceforge.net/",
        "description": "Tool for hiding and extracting data inside images and audio files using steganography.",
        "category": "Forensics"
    }
]


def get_initials(name: str) -> str:
    return "".join([word[0].upper() for word in name.split() if word][:2])


winners_summary = {
    "total_teams": 12,
    "levels_tracked": 5,
    "winners": [
        {
            "rank": 2,
            "team_name": "DedSec",
            "photo_url": "",
            "prize": "Silver bracket",
        },
        {
            "rank": 1,
            "team_name": "CyberNeragallu",
            "photo_url": "",
            "prize": "Gold bracket",
        },
        {
            "rank": 3,
            "team_name": "Error404",
            "photo_url": "",
            "prize": "Bronze bracket",
        },
    ],
    "level_progress": [
        {"level": 0, "teams_crossed": 11},
        {"level": 1, "teams_crossed": 11},
        {"level": 2, "teams_crossed": 11},
        {"level": 3, "teams_crossed": 8},
        {"level": 4, "teams_crossed": 3},
    ],
}

for team in winners_summary["winners"]:
    team["initials"] = get_initials(team["team_name"])


@app.route("/")
def index():
    return render_template(
        "index.html",
        registration_open=os.getenv("REGISTRATION_OPEN", "false").lower() == "true",
        google_form_url=os.getenv("GOOGLE_FORM_URL", "#")
    )

@app.route("/announcement")
def announcement_page():
    sorted_ann = sorted(announcements, key=lambda x: x["timestamp"], reverse=True)
    return render_template("announcement.html", announcements=sorted_ann)

@app.route("/tools")
def tools_page():
    categories = sorted(set(t["category"] for t in tools))
    return render_template("tools.html", tools=tools, categories=categories)


@app.route("/winners")
def winners_page():
    sorted_winners = sorted(winners_summary["winners"], key=lambda w: w["rank"])
    return render_template("winners.html", summary={**winners_summary, "winners": sorted_winners})


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 4000)), debug=True)