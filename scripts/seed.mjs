// Generates data/seed.json with demo users, projects and timesheet entries.
// Run with: npm run seed
import { writeFileSync, rmSync, mkdirSync } from "node:fs";
import path from "node:path";

const TOTAL_WEEKS = 52;
const FIRST_MONDAY = Date.UTC(2025, 11, 29); // Monday, 29 December 2025 (week containing 1 January 2026)
const DAY_MS = 24 * 60 * 60 * 1000;

const users = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
];

const projects = [
  { id: "p1", name: "Ticktock Web App" },
  { id: "p2", name: "Client Portal" },
  { id: "p3", name: "Marketing Website" },
  { id: "p4", name: "Mobile App" },
];

const workTypes = [
  "Bug fixes",
  "Feature development",
  "Code review",
  "Meetings",
  "Testing",
  "Documentation",
];

const tasks = [
  "Homepage Development",
  "API integration",
  "Fix login redirect bug",
  "Sprint planning meeting",
  "Write unit tests",
  "Review pull requests",
];

// Repeating pattern so the table shows every status.
const weekPattern = [
  "completed",
  "completed",
  "incomplete",
  "completed",
  "missing",
];

function toISODate(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

const entries = [];

for (let week = 1; week <= TOTAL_WEEKS; week++) {
  const kind = weekPattern[(week - 1) % weekPattern.length];
  if (kind === "missing") continue;

  // completed = 5 days x 2 tasks x 4 hrs = 40 hrs
  // incomplete = 3 days x 2 tasks x 4 hrs = 24 hrs
  const daysWithWork = kind === "completed" ? 5 : 3;
  const weekStart = FIRST_MONDAY + (week - 1) * 7 * DAY_MS;

  for (let day = 0; day < daysWithWork; day++) {
    for (let slot = 0; slot < 2; slot++) {
      const n = week + day + slot;
      entries.push({
        id: `e-${week}-${day}-${slot}`,
        userId: "u1",
        date: toISODate(weekStart + day * DAY_MS),
        projectId: projects[n % projects.length].id,
        workType: workTypes[n % workTypes.length],
        description: tasks[n % tasks.length],
        hours: 4,
      });
    }
  }
}

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });
writeFileSync(
  path.join(dataDir, "seed.json"),
  JSON.stringify({ users, projects, workTypes, entries }, null, 2) + "\n",
);
// Remove the local working database so it is re-created from the new seed.
rmSync(path.join(dataDir, "db.json"), { force: true });

console.log(
  `Seeded ${users.length} users, ${projects.length} projects, ${entries.length} entries.`,
);
