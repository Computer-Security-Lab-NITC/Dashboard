import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Countdown } from "../components/Countdown";
import { getConfig, getCurrentYearWithDetails } from "../services/api";
import { fallbackConfig, fallbackCurrentYear, fallbackCurrentYearDetail } from "../services/fallbackData";
import type { AppConfig, YearDetail, YearInfo } from "../services/types";

export function HomePage() {
  const [config, setConfig] = useState<AppConfig>(fallbackConfig);
  const [yearInfo, setYearInfo] = useState<YearInfo>(fallbackCurrentYear);
  const [yearDetail, setYearDetail] = useState<YearDetail>(fallbackCurrentYearDetail);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    getConfig(() => setUsingFallback(true)).then(setConfig);

    getCurrentYearWithDetails(() => setUsingFallback(true)).then(({ yearInfo, yearDetail }) => {
      console.log("[HomePage] server yearInfo", yearInfo);
      console.log("[HomePage] server yearDetail", yearDetail);
      setYearInfo(yearInfo);
      setYearDetail(yearDetail);
    });
  }, []);

  const deadlineTimestamp = Date.parse(yearDetail.regDeadline);
  const deadlineExpired = !Number.isNaN(deadlineTimestamp) && deadlineTimestamp <= Date.now();
  const registrationOpen = config.registrationOpen && !deadlineExpired && !Number.isNaN(deadlineTimestamp);

  return (
    <>
      {usingFallback && (
        <div className="fallback-banner">
          default deafault — backend GET failed, showing fallback data.
        </div>
      )}
      <section className="hero">
        <p className="hero-pre">
          <span>$</span> cat event_info.txt
        </p>
        <h1 className="hero-title">
          <span className="accent" data-text={yearInfo.title}>
            {yearInfo.title}
          </span>
        </h1>
        <p className="hero-tagline">// Break it. Trace it. Learn it.</p>
        <p className="hero-desc">
          {yearDetail.desc !== "default deafault"
            ? yearDetail.desc
            : "default desc"}
        </p>
        <p className="hero-conducted">
          Conducted by <span>CSED - NITC</span>
        </p>
        <p className="hero-venue">
          Venue: <span>{yearInfo.venue}</span>
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
        <DateCard
          className="card-reg"
          label="Registration Deadline"
          value={formatDate(yearDetail.regDeadline)}
          sub={
            yearDetail.regDeadline !== "default deafault"
              ? `Deadline timestamp: ${formatTime(yearDetail.regDeadline)}`
              : "Slots are limited."
          }
        />
        <DateCard
          className="card-event"
          label="Competition Date"
          value={formatDate(yearInfo.date)}
          sub={
            yearInfo.venue !== "default deafault"
              ? `Venue: ${yearInfo.venue}`
              : "Single-day event. Venue information will appear here once loaded."
          }
        />
        <DateCard
          className="card-time"
          label="Competition Timing"
          value={`${yearDetail.eventStartTime} - ${yearDetail.eventEndTime}`}
          sub="Official contest window."
        />
      </div>

      {registrationOpen ? (
        <Countdown deadline={yearDetail.regDeadline} />
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

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="info-card">
      <div className="info-title">{title}</div>
      <div className="info-body">{children}</div>
    </div>
  );
}
