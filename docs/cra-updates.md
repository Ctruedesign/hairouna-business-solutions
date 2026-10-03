# Monthly CRA updates

The CRA updates view displays official headlines, publication dates and source links. It does not rewrite tax guidance, filing dates, calculations or HB answers. IRS sources are excluded.

Five official Atom feeds are configured in worker/cra-updates.js: individuals, businesses, GST/HST, tax tips and alerts, and announcements. Only HTTPS links under www.canada.ca/en/revenue-agency/ are published. Headlines are deduplicated and limited to the past year. Topic filters let visitors find the relevant feed.

The Monthly Canadian CRA updates GitHub Actions workflow runs at noon UTC on the first day of each month. scripts/update-cra.mjs reads the previous public/cra-updates.json snapshot and skips fetching if that UTC calendar month has already been attempted. Repeated or manual workflow runs cannot cause another check that month. An initial verified snapshot is included. A successful monthly run commits only the snapshot to main, and the existing Cloudflare Git integration deploys it. The workflow needs Actions enabled and contents-write permission; branch rules must permit its snapshot commit. No API keys, customer information or npm dependencies are needed for the job.

The site's /api/cra-updates route reads the bundled JSON snapshot through ASSETS. Visitors, page reloads and Reload saved updates never fetch CRA. If some feeds fail, their saved headlines retain previous successful check dates and show stale status. If all fail, the old snapshot is retained with an unavailable notice. The view shows the last check and next scheduled date in Toronto time. News published between checks appears after the next monthly refresh.

The first deployed Cloudflare Durable Object attempt returned all feeds unavailable, although development retrieval succeeded. Scheduled retrieval now uses the Node repository job. The existing Durable Object class and namespace binding are retained to preserve stored data; the Worker cron is removed and the object is no longer used by the API.

Verification: npm test, npm run build, and npx wrangler deploy --dry-run. After merge, open /#updates and confirm saved headlines and dates. The first monthly scheduled run should appear under GitHub Actions; a manual run in an already-checked month verifies the job without sending CRA requests.
