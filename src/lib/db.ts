import { promises as fs } from "fs";
import os from "os";
import path from "path";
import seed from "../../data/seed.json";
import type { Database, Entry } from "@/types";

// Locally we read and write data/db.json.
// On Vercel the project folder is read-only, so we use the temp folder instead.
// The file is created from data/seed.json the first time it is needed.
const DB_PATH = process.env.VERCEL
  ? path.join(os.tmpdir(), "ticktock-db.json")
  : path.join(process.cwd(), "data", "db.json");

async function readDb(): Promise<Database> {
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(content) as Database;
  } catch {
    const initial = seed as Database;
    await writeDb(initial);
    return structuredClone(initial);
  }
}

async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return (
    db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function getProjectsAndWorkTypes() {
  const db = await readDb();
  return { projects: db.projects, workTypes: db.workTypes };
}

export async function getEntriesForUser(userId: string): Promise<Entry[]> {
  const db = await readDb();
  return db.entries.filter((e) => e.userId === userId);
}

export async function getEntryById(id: string): Promise<Entry | null> {
  const db = await readDb();
  return db.entries.find((e) => e.id === id) ?? null;
}

export async function createEntry(data: Omit<Entry, "id">): Promise<Entry> {
  const db = await readDb();
  const entry: Entry = { id: crypto.randomUUID(), ...data };
  db.entries.push(entry);
  await writeDb(db);
  return entry;
}

export async function updateEntry(
  id: string,
  data: Partial<Omit<Entry, "id" | "userId">>,
) {
  const db = await readDb();
  const index = db.entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  db.entries[index] = { ...db.entries[index], ...data };
  await writeDb(db);
  return db.entries[index];
}

export async function deleteEntry(id: string): Promise<boolean> {
  const db = await readDb();
  const remaining = db.entries.filter((e) => e.id !== id);
  if (remaining.length === db.entries.length) return false;
  db.entries = remaining;
  await writeDb(db);
  return true;
}
