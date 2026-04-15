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
        "title": "Final tool list released!",
        "body": "The final list of tools for the CTF has been released. Check out the tools page for details on what will be available during the competition.",
        "tag": "info",
        "timestamp": "15-04-2026 23:00"
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
    # {
    #     "id": 1,
    #     "name": "CyberChef",
    #     "url": "https://gchq.github.io/CyberChef/",
    #     "description": "The Cyber Swiss Army Knife. Encode, decode, encrypt, and analyze data in-browser.",
    #     "category": "Misc"
    # },
    # {
    #     "id": 2,
    #     "name": "GTFOBins",
    #     "url": "https://gtfobins.github.io/",
    #     "description": "Curated list of Unix binaries that can be used to bypass local security restrictions.",
    #     "category": "Privilege Escalation"
    # },
    # {
    #     "id": 3,
    #     "name": "Burp Suite",
    #     "url": "https://portswigger.net/burp",
    #     "description": "Industry-standard web application security testing platform.",
    #     "category": "Web"
    # },
    # {
    #     "id": 5,
    #     "name": "pwntools",
    #     "url": "https://github.com/Gallopsled/pwntools",
    #     "description": "CTF framework and exploit development library for Python.",
    #     "category": "Pwn"
    # },
    # {
    #     "id": 7,
    #     "name": "John the Ripper",
    #     "url": "https://www.openwall.com/john/",
    #     "description": "Fast password cracker supporting many hash types and attack modes.",
    #     "category": "Crypto"
    # },
    # {
    #     "id": 8,
    #     "name": "Volatility",
    #     "url": "https://volatilityfoundation.org/",
    #     "description": "Advanced memory forensics framework for analyzing RAM dumps.",
    #     "category": "Forensics"
    # }
]


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


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 4000)), debug=True)