import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemePayloadToDocument,
  defaultThemePayload,
  mergeThemePayload,
  type ThemePayload,
} from "./defaultTheme";

type ThemeContextValue = {
  theme: ThemePayload;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CACHE_KEY = "storefront_theme_v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

type Cached = { at: number; theme: ThemePayload };

function readCache(): ThemePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    if (Date.now() - c.at > CACHE_TTL_MS) return null;
    return mergeThemePayload(c.theme);
  } catch {
    return null;
  }
}

function writeCache(theme: ThemePayload) {
  try {
    const payload: Cached = { at: Date.now(), theme };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePayload>(() => {
    const cached = readCache();
    const initial = cached ?? defaultThemePayload;
    applyThemePayloadToDocument(initial);
    return initial;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch("/api/branding/theme/");
      if (!r.ok) throw new Error(`Theme HTTP ${r.status}`);
      const data = (await r.json()) as Record<string, unknown>;
      const merged = mergeThemePayload(data);
      applyThemePayloadToDocument(merged);
      setTheme(merged);
      writeCache(merged);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Theme fetch failed");
      applyThemePayloadToDocument(defaultThemePayload);
      setTheme(defaultThemePayload);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.title = theme.text.defaultTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", theme.text.defaultDescription);

    const toAbsolute = (href: string) =>
      /^https?:\/\//i.test(href)
        ? href
        : new URL(href, window.location.origin).href;

    const fav = theme.assets.faviconUrl;
    let link = document.querySelector(
      'link[rel="icon"]',
    ) as HTMLLinkElement | null;
    if (fav) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = fav;
    }

    const og = theme.assets.ogImageUrl;
    let ogMeta = document.querySelector(
      'meta[property="og:image"]',
    ) as HTMLMetaElement | null;
    if (og) {
      if (!ogMeta) {
        ogMeta = document.createElement("meta");
        ogMeta.setAttribute("property", "og:image");
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute("content", toAbsolute(og));
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, loading, error, refresh }),
    [theme, loading, error, refresh],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
