import type { SampleNote } from "./types";

const BASE = "/api/sample/notes/";

export async function listNotes(): Promise<SampleNote[]> {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error(`List failed: ${r.status}`);
  return r.json();
}

export async function createNote(data: {
  title: string;
  body: string;
}): Promise<SampleNote> {
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`Create failed: ${r.status}`);
  return r.json();
}

export async function updateNote(
  id: number,
  data: Partial<Pick<SampleNote, "title" | "body">>,
): Promise<SampleNote> {
  const r = await fetch(`${BASE}${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`Update failed: ${r.status}`);
  return r.json();
}

export async function deleteNote(id: number): Promise<void> {
  const r = await fetch(`${BASE}${id}/`, { method: "DELETE" });
  if (!r.ok) throw new Error(`Delete failed: ${r.status}`);
}
