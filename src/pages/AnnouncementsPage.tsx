import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { getAnnouncements } from "../services/api";
import { fallbackAnnouncements } from "../services/fallbackData";
import type { Announcement } from "../services/types";

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallbackAnnouncements);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    getAnnouncements(() => setUsingFallback(true)).then((items) => {
      setAnnouncements([...items].sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    });
  }, []);

  return (
    <>
      <PageHeader title="UPDATES" subtitle="Live announcements & competition notices" />
      {usingFallback && (
        <div className="fallback-banner">
          default deafault — backend GET failed, showing fallback data.
        </div>
      )}
      <div className="ann-list">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <article
              className={`ann-card tag-${announcement.tag}`}
              key={announcement.id}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="ann-header">
                <div className="ann-title-row">
                  <span className={`tag tag-${announcement.tag}`}>{announcement.tag}</span>
                  <h2 className="ann-title">{announcement.title}</h2>
                </div>
                <span className="ann-meta">{announcement.timestamp}</span>
              </div>
              <p className="ann-body">{announcement.body}</p>
              <div className="ann-footer">
                <span className="ann-meta">ID #{announcement.id}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <div className="icon">[ ]</div>
            <p>No announcements yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
