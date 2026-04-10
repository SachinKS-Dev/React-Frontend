import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import type { SampleNote } from "./types";
import "./sample-demo.css";

export default function SampleNotesDemo() {
  const [notes, setNotes] = useState<SampleNote[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setError(null);
    const data = await api.listNotes();
    setNotes(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load notes"),
      )
      .finally(() => setLoading(false));
  }, [refresh]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (editingId != null) {
        await api.updateNote(editingId, { title: title.trim(), body });
        setEditingId(null);
      } else {
        await api.createNote({ title: title.trim(), body });
      }
      setTitle("");
      setBody("");
      await refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(note: SampleNote) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setBody("");
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this note?")) return;
    setBusy(true);
    setError(null);
    try {
      await api.deleteNote(id);
      if (editingId === id) cancelEdit();
      await refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="sample-demo" aria-labelledby="sample-crud-heading">
      <h2 id="sample-crud-heading">Sample CRUD (demo)</h2>
      <p className="sample-demo__hint">
        Demo-only module under <code>src/sample</code>. Remove it when you build
        the real app.
      </p>

      {error && <p className="sample-demo__error">{error}</p>}

      <form className="sample-demo__form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            disabled={busy}
          />
        </label>
        <label>
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            disabled={busy}
          />
        </label>
        <div className="sample-demo__actions">
          <button type="submit" disabled={busy || !title.trim()}>
            {editingId != null ? "Save changes" : "Add note"}
          </button>
          {editingId != null && (
            <button type="button" onClick={cancelEdit} disabled={busy}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <ul className="sample-demo__list">
        {notes.map((n) => (
          <li key={n.id} className="sample-demo__card">
            <div className="sample-demo__card-head">
              <strong>{n.title}</strong>
              <span className="sample-demo__meta">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
            {n.body && <p className="sample-demo__body">{n.body}</p>}
            <div className="sample-demo__row-actions">
              <button
                type="button"
                onClick={() => startEdit(n)}
                disabled={busy}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(n.id)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && notes.length === 0 && !error && (
        <p className="sample-demo__empty">No notes yet. Add one above.</p>
      )}
      {loading && <p className="sample-demo__empty">Loading notes…</p>}
    </section>
  );
}
