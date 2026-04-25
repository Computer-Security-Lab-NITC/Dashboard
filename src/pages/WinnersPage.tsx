import { Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { getWinnersSummary } from "../services/api";
import { fallbackWinnersSummary } from "../services/fallbackData";
import type { WinningTeam, WinnersSummary } from "../services/types";

const rankLabels: Record<WinningTeam["rank"], string> = {
  1: "First Place",
  2: "Second Place",
  3: "Third Place",
};

export function WinnersPage() {
  const [summary, setSummary] = useState<WinnersSummary>(fallbackWinnersSummary);

  useEffect(() => {
    getWinnersSummary().then(setSummary);
  }, []);

  const maxTeamsCrossed = useMemo(
    () => Math.max(...summary.levelProgress.map((item) => item.teamsCrossed), summary.totalTeams, 1),
    [summary.levelProgress, summary.totalTeams],
  );

  return (
    <>
      <PageHeader title="WINNERS" subtitle="Final standings & level progression" />

      <section className="winners-overview" aria-label="Competition summary">
        <div className="stat-panel">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{summary.totalTeams}</div>
            <div className="stat-label">teams participated</div>
          </div>
        </div>
        <div className="stat-panel accent">
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
          <div>
            <div className="stat-value">{summary.levelProgress.length}</div>
            <div className="stat-label">levels tracked</div>
          </div>
        </div>
      </section>

      <p className="section-label">Podium</p>
      <section className="podium-grid" aria-label="Top three teams">
        {summary.winners
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((team) => (
            <article className={`winner-card rank-${team.rank}`} key={team.rank}>
              <div className="winner-photo" aria-hidden="true">
                {team.photoUrl ? (
                  <img src={team.photoUrl} alt="" />
                ) : (
                  <span>{getInitials(team.teamName)}</span>
                )}
              </div>
              <div className="winner-rank">#{team.rank}</div>
              <h2 className="winner-name">{team.teamName}</h2>
              <p className="winner-place">{rankLabels[team.rank]}</p>
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
          {summary.levelProgress.map((item) => {
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
    </>
  );
}

function getInitials(teamName: string) {
  return teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
