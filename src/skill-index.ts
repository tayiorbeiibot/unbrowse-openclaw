/**
 * Skill Index Client — Search the cloud skill marketplace.
 *
 * Handles communication with the skill index API for searching and viewing
 * skill metadata. Payment and publishing features have been removed.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface SkillSummary {
  skillId: string;
  name: string;
  description: string;
  category: string | null;
  authType: string | null;
  serviceName: string | null;
  domain: string | null;
  downloadCount: number;
  creatorWallet: string | null;
  priceUsdc: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Version info
  latestVersionHash?: string;
  totalVersions?: number;
  // Badge info
  badge?: "official" | "highlighted" | "deprecated" | "verified";
  badgeReason?: string;
  // Trending info
  velocity?: number;
  downloads24h?: number;
}

export interface SearchResult {
  skills: SkillSummary[];
  total: number;
}

// ── Client ───────────────────────────────────────────────────────────────────

export class SkillIndexClient {
  private indexUrl: string;

  constructor(opts: { indexUrl: string }) {
    this.indexUrl = opts.indexUrl.replace(/\/$/, "");
  }

  /** Search the skill marketplace (free). */
  async search(
    query: string,
    opts?: { limit?: number },
  ): Promise<SearchResult> {
    const url = new URL(`${this.indexUrl}/marketplace/skills`);
    if (query) url.searchParams.set("q", query);
    if (opts?.limit) url.searchParams.set("limit", String(opts.limit));

    let resp: Response;
    try {
      resp = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(10_000),
      });
    } catch (err) {
      const msg = (err as Error).message ?? "";
      const name = (err as Error).name ?? "";
      if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || name === "AbortError" || name === "TimeoutError" || msg.includes("timeout")) {
        throw new Error(`Skill marketplace not reachable (${this.indexUrl}). The server may be offline or the URL misconfigured.`);
      }
      throw err;
    }

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Search failed (${resp.status}): ${text}`);
    }

    const data = await resp.json();
    return {
      skills: data.skills || [],
      total: data.count || 0,
    };
  }

  /** Get skill summary (free - metadata only, no content). */
  async getSkillSummary(id: string): Promise<SkillSummary> {
    const resp = await fetch(`${this.indexUrl}/marketplace/skills/${encodeURIComponent(id)}`, {
      headers: {
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Get skill failed (${resp.status}): ${text}`);
    }

    const data = await resp.json();
    return data.skill;
  }

  /**
   * Health check — verify the server is reachable (fast, no auth required).
   * Returns true if reachable, false otherwise.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const resp = await fetch(`${this.indexUrl}/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      return resp.ok;
    } catch {
      return false;
    }
  }
}
