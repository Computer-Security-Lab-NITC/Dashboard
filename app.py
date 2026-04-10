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
        "id": 4,
        "name": "exploitdb",
        "url": "https://www.exploit-db.com/",
        "description": "Comprehensive archive of public exploits and vulnerable software.",
        "category": "Exploitation"
    },
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

next_id = {"announcements": 2, "tools": 5}


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


@app.route("/admin/announcement/add", methods=["POST"])
def add_announcement():
    title = request.form.get("title", "").strip()
    body = request.form.get("body", "").strip()
    tag = request.form.get("tag", "info")
    password = request.form.get("password", "")
    if password != os.getenv("PASSWORD"):
        flash("Unauthorized: Incorrect password.", "danger")
        return redirect(url_for("index"))
    if title and body:
        announcements.append({
            "id": next_id["announcements"],
            "title": title,
            "body": body,
            "tag": tag,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        })
        next_id["announcements"] += 1
        flash("Announcement posted.", "success")
    return redirect(url_for("index"))


# @app.route("/admin/announcement/delete/<int:ann_id>", methods=["POST"])
# def delete_announcement(ann_id):
#     global announcements
#     announcements = [a for a in announcements if a["id"] != ann_id]
#     flash("Announcement removed.", "success")
#     return redirect(url_for("index"))


# @app.route("/admin/tool/add", methods=["POST"])
# def add_tool():
#     name = request.form.get("name", "").strip()
#     url = request.form.get("url", "").strip()
#     description = request.form.get("description", "").strip()
#     category = request.form.get("category", "Misc").strip()
#     if name and url:
#         tools.append({
#             "id": next_id["tools"],
#             "name": name,
#             "url": url,
#             "description": description,
#             "category": category
#         })
#         next_id["tools"] += 1
#         flash("Tool added.", "success")
#     return redirect(url_for("tools_page"))


# @app.route("/admin/tool/delete/<int:tool_id>", methods=["POST"])
# def delete_tool(tool_id):
#     global tools
#     tools = [t for t in tools if t["id"] != tool_id]
#     flash("Tool removed.", "success")
#     return redirect(url_for("tools_page"))


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 4000)), debug=True)