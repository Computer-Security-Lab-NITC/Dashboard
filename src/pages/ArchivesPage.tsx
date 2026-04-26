import { CalendarDays, Camera, ChevronDown, Github, Linkedin, MapPin, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { getArchiveByYear, getArchiveYears } from "../services/api";
import { fallbackArchives } from "../services/fallbackData";
import type { ArchiveEvent } from "../services/types";

export function ArchivesPage() {
  const [archiveYears, setArchiveYears] = useState<number[]>(fallbackArchives.map((archive) => archive.year));
  const [archiveByYear, setArchiveByYear] = useState<Record<number, ArchiveEvent>>(
    Object.fromEntries(fallbackArchives.map((archive) => [archive.year, archive])),
  );
  const [selectedYear, setSelectedYear] = useState(fallbackArchives[0]?.year ?? new Date().getFullYear() - 1);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    getArchiveYears(() => setUsingFallback(true)).then((years) => {
      const sortedYears = [...years].sort((a, b) => b - a);

      setArchiveYears(sortedYears);
      setSelectedYear((currentYear) =>
        sortedYears.includes(currentYear)
          ? currentYear
          : sortedYears[0] ?? currentYear,
      );
    });
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      return;
    }

    getArchiveByYear(selectedYear, () => setUsingFallback(true)).then((archive) => {
      setArchiveByYear((current) => ({
        ...current,
        [archive.year]: archive,
      }));
    });
  }, [selectedYear]);

  const selectedArchive = useMemo(
    () => archiveByYear[selectedYear],
    [archiveByYear, selectedYear],
  );
  const maxTeamsCrossed = useMemo(
    () => Math.max(...(selectedArchive?.levelProgress.map((item) => item.teamsCrossed) ?? []), selectedArchive?.totalTeams ?? 1, 1),
    [selectedArchive],
  );

  return (
    <>
      <PageHeader title="ARCHIVES" subtitle="Previous editions, winners & memories" />
      {usingFallback && (
        <div className="fallback-banner">
          default deafault — backend GET failed, showing fallback data.
        </div>
      )}

      <div className="archive-control">
        <span className="archive-control-label">Select Edition</span>
        <div className="archive-year-picker">
          <button
            className="archive-year-trigger"
            type="button"
            aria-expanded={isYearPickerOpen}
            aria-haspopup="listbox"
            onClick={() => setIsYearPickerOpen((current) => !current)}
          >
            <span>{selectedArchive?.year ?? selectedYear}</span>
            <ChevronDown size={18} />
          </button>

          {isYearPickerOpen && (
            <div className="archive-year-menu" role="listbox" aria-label="Archive editions">
              {archiveYears.map((year) => (
                <button
                  className={`archive-year-option ${year === selectedYear ? "active" : ""}`}
                  key={year}
                  type="button"
                  role="option"
                  aria-selected={year === selectedYear}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearPickerOpen(false);
                  }}
                >
                  <span>{year}</span>
                  <small>NullPointer CTF</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedArchive ? (
        <>
          <section className="archive-hero">
            <div>
              <p className="archive-kicker">// edition_{selectedArchive.year}</p>
              <h1>{selectedArchive.title}</h1>
              <p>{selectedArchive.description}</p>
            </div>
            <div className="archive-meta-grid">
              <ArchiveMeta icon={<CalendarDays size={20} />} label="Date" value={selectedArchive.date} />
              {selectedArchive.venue && <ArchiveMeta icon={<MapPin size={20} />} label="Venue" value={selectedArchive.venue} />}
              {selectedArchive.totalTeams && <ArchiveMeta icon={<Users size={20} />} label="Teams" value={`${selectedArchive.totalTeams}`} />}
            </div>
          </section>

          <p className="section-label">Winners</p>
          <section className="archive-winners">
            {selectedArchive.winners
              .slice()
              .sort((a, b) => a.rank - b.rank)
              .map((winner) => (
                <article className="archive-winner-card" key={winner.rank}>
                  <span className="archive-winner-rank">#{winner.rank}</span>
                  <Trophy size={18} />
                  <span>{winner.teamName}</span>
                </article>
              ))}
          </section>

          <hr className="section-rule" />

          <p className="section-label">Conducted By</p>
          <section className="archive-conducted-by" aria-label="People who conducted this CTF">
            {selectedArchive.conductedBy.map((person) => (
              <article className="archive-person" key={person.name}>
                <div>
                  <span className="archive-person-name">{person.name}</span>
                  <span className="archive-person-type">{person.type}</span>
                </div>
                <div className="archive-person-links">
                  {person.githubUrl && (
                    <a href={person.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on GitHub`}>
                      <Github size={15} />
                    </a>
                  )}
                  {person.linkedinUrl && (
                    <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn`}>
                      <Linkedin size={15} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>

          <hr className="section-rule" />

          <p className="section-label">Level Progress</p>
          <section className="progress-panel" aria-label="Teams crossing each level">
            <div className="progress-heading">
              <span>Level</span>
              <span>Teams Crossed</span>
            </div>

            <div className="level-chart">
              {selectedArchive.levelProgress.map((item) => {
                const width = `${Math.max((item.teamsCrossed / maxTeamsCrossed) * 100, 3)}%`;

                return (
                  <div className="level-row" key={item.level}>
                    <div className="level-label">Level {item.level}</div>
                    <div className="level-bar-wrap">
                      <div className="level-bar" style={{ width }} />
                    </div>
                    <div className="level-count">{item.teamsCrossed}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="section-rule" />

          <p className="section-label">Highlights</p>
          <section className="archive-details">
            <ul>
              {selectedArchive.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          <hr className="section-rule" />

          <p className="section-label">Photos</p>
          <section className="archive-gallery">
            {selectedArchive.photos && selectedArchive.photos.length > 0 ? (
              selectedArchive.photos.map((photo) => (
                <figure className="archive-photo" key={photo.id}>
                  <img src={photo.url} alt={photo.alt} />
                  <figcaption>
                    <span>{photo.kind}</span>
                    {photo.caption ?? photo.alt}
                  </figcaption>
                </figure>
              ))
            ) : (
              <div className="archive-photo-empty">
                <Camera size={28} />
                <p>Photos for this edition can be added when the archive assets are ready.</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="empty-state">
          <div className="icon">[ ]</div>
          <p>No archive entries yet.</p>
        </div>
      )}
    </>
  );
}

function ArchiveMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="archive-meta-card">
      <div className="archive-meta-icon">{icon}</div>
      <div>
        <div className="archive-meta-label">{label}</div>
        <div className="archive-meta-value">{value}</div>
      </div>
    </div>
  );
}
