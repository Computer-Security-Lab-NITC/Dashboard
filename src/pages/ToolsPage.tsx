import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { getTools } from "../services/api";
import { fallbackTools } from "../services/fallbackData";
import type { Tool } from "../services/types";

const allCategories = "all";

function getDisplayUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>(fallbackTools);
  const [activeCategory, setActiveCategory] = useState(allCategories);

  useEffect(() => {
    getTools().then(setTools);
  }, []);

  const categories = useMemo(
    () => [...new Set(tools.map((tool) => tool.category))].sort(),
    [tools],
  );

  const visibleTools = activeCategory === allCategories
    ? tools
    : tools.filter((tool) => tool.category === activeCategory);

  return (
    <>
      <PageHeader title="TOOLS" subtitle="Recommended resources & utilities" />

      <div className="filter-bar" aria-label="Filter tools by category">
        <button
          className={`filter-btn ${activeCategory === allCategories ? "active" : ""}`}
          type="button"
          onClick={() => setActiveCategory(allCategories)}
        >
          ALL
        </button>
        {categories.map((category) => (
          <button
            className={`filter-btn ${activeCategory === category ? "active" : ""}`}
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tool-grid">
        {visibleTools.length > 0 ? (
          visibleTools.map((tool, index) => (
            <article className="tool-card" key={tool.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="tool-header">
                <h2 className="tool-name">{tool.name}</h2>
                <span className="tool-cat">{tool.category}</span>
              </div>
              <p className="tool-desc">{tool.description}</p>
              <div className="tool-footer">
                <a className="tool-link" href={tool.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  <span>{getDisplayUrl(tool.url)}</span>
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <div className="icon">[ ]</div>
            <p>No tools yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
