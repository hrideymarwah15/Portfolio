import { writeFile, rename } from "node:fs/promises";
const username = "hrideymarwah15";
const headers = { "User-Agent": "Hridey-Portfolio", Accept: "application/vnd.github+json" };
const get = async (url, json = false) => {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return json ? response.json() : response.text();
};
try {
  const query = encodeURIComponent(`author:${username} repo:jax-ml/jax is:pr is:merged`);
  const [html, prs] = await Promise.all([
    get(`https://github.com/users/${username}/contributions`),
    get(`https://api.github.com/search/issues?q=${query}&per_page=4&sort=updated`, true),
  ]);
  const tooltips = new Map([...html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)].map(m => [m[1], m[2].replace(/<[^>]*>/g, "")]));
  const days = [...html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)].map(m => {
    const attrs = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
    const count = tooltips.get(attrs.id)?.match(/^([\d,]+) contribution/);
    return { date: attrs["data-date"], count: count ? Number(count[1].replaceAll(",", "")) : 0, level: Number(attrs["data-level"]) };
  }).sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 350 || days.some(d => !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isInteger(d.count) || !Number.isInteger(d.level) || d.level < 0 || d.level > 4)) throw new Error("GitHub calendar markup changed; existing snapshot preserved.");
  const data = { username, source: `https://github.com/${username}`, fetchedAt: new Date().toISOString(), start: days[0].date, end: days.at(-1).date, total: days.reduce((n, d) => n + d.count, 0), days, jax: { mergedCount: prs.total_count, pullRequests: prs.items.map(p => ({ title: p.title, number: p.number, url: p.html_url, mergedAt: p.pull_request.merged_at })) } };
  const destination = new URL("../src/data/github-activity.json", import.meta.url);
  const temporary = new URL("../src/data/github-activity.json.tmp", import.meta.url);
  await writeFile(temporary, JSON.stringify(data, null, 2) + "\n");
  await rename(temporary, destination);
  console.log(`Updated ${days.length} days, ${data.total} GitHub contributions, ${data.jax.mergedCount} merged JAX PRs.`);
} catch (error) {
  console.error(`Activity refresh failed: ${error.message}`);
  process.exitCode = 1;
}
