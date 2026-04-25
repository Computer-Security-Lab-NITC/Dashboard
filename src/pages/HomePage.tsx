import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Countdown } from "../components/Countdown";
import { getConfig } from "../services/api";
import { fallbackConfig } from "../services/fallbackData";
import type { AppConfig } from "../services/types";

export function HomePage() {
  const [config, setConfig] = useState<AppConfig>(fallbackConfig);

  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  return (
    <>
      <section className="hero">
        <p className="hero-pre">
          <span>$</span> cat event_info.txt
        </p>
        <h1 className="hero-title">
          <span className="accent" data-text="NullPointer">
            NullPointer
          </span>{" "}
          CTF 2026
        </h1>
        <p className="hero-tagline">// Break it. Trace it. Learn it.</p>
        <p className="hero-desc">
          An open internet Capture The Flag competition designed for curious minds at every skill
          level. Whether you are new to cybersecurity or already exploring CTFs, this event is built
          to help you learn, solve, and compete. Challenges may cover web exploitation, reverse
          engineering, cryptography, forensics, and binary exploitation.
        </p>
        <p className="hero-conducted">
          Conducted by <span>CSED - NITC</span>
        </p>
        <div className="hero-actions">
          {config.registrationOpen ? (
            <a className="hero-cta" href={config.googleFormUrl} target="_blank" rel="noopener noreferrer">
              Register Your Team <ArrowRight size={17} />
            </a>
          ) : (
            <span className="hero-closed">Registration Closed</span>
          )}
          <Link className="hero-cta secondary" to="/tools">
            Go to Tools <ArrowRight size={17} />
          </Link>
          <Link className="hero-cta warn" to="/announcement">
            Check Updates <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <hr className="section-rule" />

      <p className="section-label">Important Dates</p>
      <div className="dates-grid">
        <DateCard className="card-reg" label="Registration Deadline" value="10/04/2026" sub="Closes at 11:59 PM. Slots are limited." />
        <DateCard className="card-event" label="Competition Date" value="16/04/2026" sub="Single-day event. In-person at SSL labs." />
        <DateCard className="card-time" label="Competition Timing" value="6:00 PM - 10:00 PM" sub="4-hour window. All challenges unlock at 6 PM sharp." />
      </div>

      {config.registrationOpen ? (
        <Countdown />
      ) : (
        <div className="countdown-wrap">
          <div className="countdown-label">Registration Status</div>
          <p className="status-closed">// Registration is closed.</p>
        </div>
      )}

      <hr className="section-rule" />

      <p className="section-label">Instructions</p>
      <div className="instructions-preview">
        <p className="instructions-intro">Before the event, please make sure you complete the following:</p>
        <ol>
          <li>Register your team using the Google Form linked on the homepage. Keep in mind that slots are limited.</li>
          <li>Confirmation will be sent to the registered email along with the WhatsApp link by <strong>11/04/2026</strong>.</li>
          <li>
            Go through the <Link to="/tools">Tools page</Link>. We recommend installing these on your systems beforehand.
          </li>
          <li>
            Always check the <Link to="/announcement" className="warn-link">Updates page</Link> for the latest announcements.
          </li>
        </ol>
      </div>

      <hr className="section-rule" />

      <p className="section-label">Registration Info</p>
      <div className="info-grid">
        <InfoCard title="Team Size">Exactly <span className="hi">2 members</span> per team. Solo entries are not accepted.</InfoCard>
        <InfoCard title="Limited Slots">
          Initial screening is based on the <span className="hi">submission time and motivation provided in the form</span>. Registrations may close early once all slots are filled.
        </InfoCard>
        <InfoCard title="Updates Matter">
          Participants should <span className="hi">always check the Updates page</span> for the latest notices, clarifications, and announcements.
        </InfoCard>
      </div>

      <hr className="section-rule" />

      <p className="section-label">Prizes</p>
      <div className="highlight-card">
        <div className="highlight-title">Winner Rewards</div>
        <div className="highlight-main">Winners will get surprise gifts!</div>
        <div className="highlight-sub">Perform well, climb the scoreboard, and compete for exciting surprise gifts reserved for the top teams.</div>
      </div>

      <hr className="section-rule" />

      <p className="section-label">Why Participate</p>
      <div className="info-grid">
        <InfoCard title="Open Internet CTF">
          This is an <span className="hi">open internet</span> event. Participants may search, read, learn, and use online references during the competition.
        </InfoCard>
        <InfoCard title="Learn the Tools Beforehand">
          We provide a dedicated <Link to="/tools">Tools page</Link> to help you prepare before the CTF. You are expected to install these on your systems.
        </InfoCard>
        <InfoCard title="Beginner Friendly">New to CTFs? No problem. This event is designed to be approachable while still being fun and competitive.</InfoCard>
      </div>

      <hr className="section-rule" />

      <div className={`reg-banner ${config.registrationOpen ? "" : "closed"}`}>
        <div className="reg-banner-text">
          {config.registrationOpen ? (
            <>
              <h3>Ready to compete?</h3>
              <p>Register as a 2-person team via the Google Form. <span className="warn">Slots are limited - register early.</span></p>
            </>
          ) : (
            <>
              <h3>Registration Closed</h3>
              <p><span className="danger">Registration is currently closed.</span> Please continue checking the Updates page for announcements.</p>
            </>
          )}
        </div>
        {config.registrationOpen ? (
          <a className="btn btn-primary" href={config.googleFormUrl} target="_blank" rel="noopener noreferrer">REGISTER NOW <ArrowRight size={16} /></a>
        ) : (
          <span className="btn btn-disabled">REGISTRATION CLOSED</span>
        )}
      </div>
    </>
  );
}

function DateCard({ className, label, value, sub }: { className: string; label: string; value: string; sub: string }) {
  return (
    <div className={`date-card ${className}`}>
      <div className="date-card-label">{label}</div>
      <div className="date-card-value">{value}</div>
      <div className="date-card-sub">{sub}</div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="info-card">
      <div className="info-title">{title}</div>
      <div className="info-body">{children}</div>
    </div>
  );
}
