import { useEffect, useState } from "react";

const registrationDeadline = new Date(2026, 3, 10, 23, 59, 59).getTime();

function getRemaining() {
  const diff = Math.max(registrationDeadline - Date.now(), 0);
  const total = Math.floor(diff / 1000);

  return {
    expired: diff <= 0,
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const values = [
    { label: "days", value: pad(remaining.days) },
    { label: "hours", value: pad(remaining.hours) },
    { label: "mins", value: pad(remaining.minutes) },
    { label: "secs", value: pad(remaining.seconds) },
  ];

  return (
    <div className="countdown-wrap">
      <div className="countdown-label">Registration closes in</div>
      <div className="countdown">
        {values.map((item, index) => (
          <div className="countdown-pair" key={item.label}>
            {index > 0 && <span className="cd-colon">:</span>}
            <div className="cd-block">
              <span className={`cd-num ${remaining.expired ? "expired" : ""}`}>{item.value}</span>
              <span className="cd-unit">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      {remaining.expired && <p className="cd-expired-note">// Registration has closed.</p>}
    </div>
  );
}
