# Monthly CRA updates

The homepage's CRA updates view displays official headlines, publication dates and source links. It does not rewrite tax guidance, filing dates, calculations or HB answers. IRS sources are excluded.

Five official Atom feeds are configured in `worker/cra-updates.js`: individuals, businesses, GST/HST, tax tips and alerts, and announcements. Only HTTPS links under `www.canada.ca/en/revenue-agency/` are published. Headlines are deduplicated and limited to the past year. Topic filters let visitors find the relevant feed.

Cloudflare runs `0 12 1 * *`: noon UTC on the first day of each month. A single SQLite-backed Durable Object stores the snapshot. First use initializes the current month's snapshot; subsequent visitor requests only read saved results. The month is persisted before fetching, so repeated triggers, reloads and restarts cannot cause a second CRA fetch batch in that calendar month, including after failures. Calendar-month boundaries are UTC. The view shows the last check and next scheduled date in Toronto time.

When some feeds fail, their saved headlines retain the previous successful source-check date and are marked stale. If all fail, the old snapshot remains visible with an unavailable status. There is no automatic retry within the month. “Reload saved updates” retries loading Hairouna's saved snapshot; it does not check CRA again.

Deployment uses the existing Cloudflare Worker, adding an ASSETS binding, `/api/*` Worker routing, the monthly cron and the `CraMonthlyUpdates` Durable Object with the `cra-monthly-v1` SQLite migration. No API key or customer information is required. A first deployment provisions the namespace; a versions-only preview can reject the initial migration, requiring a normal production deployment before previews of that class work.

Verification: `npm test`, `npm run build`, and `npx wrangler deploy --dry-run`. After deployment, open `/#updates`, confirm dated CRA headlines appear and the monthly schedule is listed in Cloudflare. Future news is only detected at the next monthly check.
