import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  MainLayout,
  SiteFooter,
  SiteHeader,
} from "react-code-base";
import { StoreBrandLink } from "../components/StoreBrandLink.tsx";
import { useTheme } from "../theme/ThemeProvider.tsx";

function getCookie(name: string): string | null {
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")}=([^;]*)`),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export default function AppearancePage() {
  const { theme, refresh } = useTheme();
  const [primary, setPrimary] = useState(theme.colors.primary);
  const [storeName, setStoreName] = useState(theme.text.storeName);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrimary(theme.colors.primary);
    setStoreName(theme.text.storeName);
  }, [theme]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);
    const csrf = getCookie("csrftoken");
    try {
      const r = await fetch("/api/branding/theme/", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrf ? { "X-CSRFToken": csrf } : {}),
        },
        body: JSON.stringify({
          colors: { primary },
          text: { storeName },
        }),
      });
      if (r.status === 403) {
        setStatus(
          "Forbidden — log in as a staff user at the Django admin, then return here (same browser).",
        );
        return;
      }
      if (!r.ok) {
        setStatus(`Save failed (HTTP ${r.status}).`);
        return;
      }
      setStatus("Saved. Theme updated.");
      await refresh();
    } catch {
      setStatus("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout
      header={
        <SiteHeader
          brandSlot={<StoreBrandLink />}
          nav={
            <>
              <Link to="/" className="rcb-text-link">
                Home
              </Link>
              <Link to="/sample" className="rcb-text-link">
                Sample
              </Link>
            </>
          }
        />
      }
      footer={
        <SiteFooter>
          <span>
            Full branding (logos, SEO fields) is in{" "}
            <a
              href="http://localhost:8000/admin/branding/storetheme/"
              className="rcb-text-link"
              target="_blank"
              rel="noreferrer"
            >
              Django admin → Store theme
            </a>
            .
          </span>
        </SiteFooter>
      }
    >
      <div className="main landing-root max-w-xl">
        <h1 className="shared-app-shell-title">Appearance (staff)</h1>
        <p className="text-sm text-brand-muted-fg mb-4">
          Quick token edits via API. Requires an active staff session (open{" "}
          <a
            className="text-brand-accent underline"
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noreferrer"
          >
            /admin/
          </a>{" "}
          first in this browser).
        </p>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 border border-brand-border rounded-brand p-4 bg-brand-surface"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-brand-primary">Primary color</span>
            <input
              type="text"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="rounded border border-brand-border px-2 py-1 font-mono text-sm"
              placeholder="#1a1a1a"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-brand-primary">Store name</span>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="rounded border border-brand-border px-2 py-1 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-brand bg-brand-primary text-brand-primary-fg px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to theme API"}
          </button>
        </form>
        {status ? (
          <p className="mt-3 text-sm text-brand-muted-fg" role="status">
            {status}
          </p>
        ) : null}
      </div>
    </MainLayout>
  );
}
