# Dashboard Website

This repository contains the Flask-based dashboard site for the Cyber Security event.

## Requirements

- Python 3.10+ (or compatible Python 3 version)
- `pip`
- A `.env` file in the repository root

## Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=ctf-secret-key
REGISTRATION_OPEN=true
GOOGLE_FORM_URL=https://forms.gle/your_actual_form_link
PORT=4000
```

- `SECRET_KEY` is used by Flask for session and security.
- `REGISTRATION_OPEN` controls whether registration is open. Set to `false` to close registration even if the deadline has not passed.
- `GOOGLE_FORM_URL` should be updated with the actual Google Form link.
- `PORT` is the local port used by the application.

> If you change `.env`, restart the server so Flask picks up the new values.

## Installation

1. Create a Python virtual environment:

```bash
python -m venv .venv
```

2. Activate the virtual environment:

```bash
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Development

Run the Flask app locally:

```bash
python app.py
```

Then open:

```text
http://localhost:4000
```

## Production

Use a WSGI server such as Gunicorn and bind to the port provided by the environment:

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

This is the correct deployment pattern for hosting providers that supply a dynamic port value.

## Branch and Backend Note

This repository holds the static Flask dashboard site on the `main` branch.

If you want to set up a proper frontend + backend architecture instead, switch to the `react` branch for the frontend code only, and use the separate repository named `Dashboard-backend` for the backend implemented with Strapi.

- `react` branch: frontend-only React code
- `Dashboard-backend` repo: backend API with Strapi
