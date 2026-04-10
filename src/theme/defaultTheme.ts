/** Client defaults — must stay in sync with Django `branding.defaults` keys for merge behavior. */

export const THEME_VERSION = 1 as const;

export type ThemeColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  surface: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
};

export type ThemeText = {
  storeName: string;
  tagline: string;
  footerLegal: string;
  supportEmail: string;
  defaultTitle: string;
  defaultDescription: string;
};

export type ThemeAssets = {
  logoUrl: string | null;
  logoCompactUrl: string | null;
  faviconUrl: string | null;
  ogImageUrl: string | null;
};

/** Static fallbacks in `public/branding-defaults/` (Vite `BASE_URL`). */
export function brandDefaultAsset(filename: string): string {
  const root = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "";
  return `${root}/branding-defaults/${filename}`;
}

const ASSET_KEYS: (keyof ThemeAssets)[] = [
  "logoUrl",
  "logoCompactUrl",
  "faviconUrl",
  "ogImageUrl",
];

const defaultThemeAssets: ThemeAssets = {
  logoUrl: brandDefaultAsset("logo_header.png"),
  logoCompactUrl: brandDefaultAsset("logo_compact.png"),
  faviconUrl: brandDefaultAsset("favicon.png"),
  ogImageUrl: brandDefaultAsset("og_image.png"),
};

/** Keep defaults when API sends `null` / omit (meaning “no custom upload”). */
export function mergeThemeAssets(
  partial: Partial<ThemeAssets> | undefined,
): ThemeAssets {
  const out: ThemeAssets = { ...defaultThemeAssets };
  if (!partial) return out;
  for (const key of ASSET_KEYS) {
    const v = partial[key];
    if (typeof v === "string" && v.length > 0) {
      out[key] = v;
    }
  }
  return out;
}

export type ThemePayload = {
  themeVersion: typeof THEME_VERSION;
  colors: ThemeColors;
  text: ThemeText;
  assets: ThemeAssets;
};

export const defaultThemePayload: ThemePayload = {
  themeVersion: THEME_VERSION,
  colors: {
    primary: "#1a1a1a",
    primaryForeground: "#ffffff",
    secondary: "#f4f4f5",
    secondaryForeground: "#18181b",
    accent: "#3b82f6",
    accentForeground: "#ffffff",
    background: "#f6f6f6",
    surface: "#ffffff",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",
    success: "#16a34a",
    successForeground: "#ffffff",
  },
  text: {
    storeName: "Storefront",
    tagline: "Your e-commerce platform",
    footerLegal: "",
    supportEmail: "",
    defaultTitle: "Storefront",
    defaultDescription: "Shop powered by FullStack",
  },
  assets: { ...defaultThemeAssets },
};

/** Maps API / merged payload to CSS variable names on :root */
const COLOR_KEYS: (keyof ThemeColors)[] = [
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "accent",
  "accentForeground",
  "background",
  "surface",
  "muted",
  "mutedForeground",
  "border",
  "destructive",
  "destructiveForeground",
  "success",
  "successForeground",
];

function camelToCssVar(key: string): string {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function applyThemePayloadToDocument(theme: ThemePayload): void {
  const root = document.documentElement;
  for (const key of COLOR_KEYS) {
    const cssName = `--color-${camelToCssVar(key)}`;
    root.style.setProperty(cssName, theme.colors[key]);
  }
  root.style.setProperty(
    "--font-sans",
    'system-ui, -apple-system, "Segoe UI", sans-serif',
  );
  root.style.setProperty("--font-heading", "var(--font-sans)");
  root.style.setProperty("--radius-brand", "0.5rem");
}

export function mergeThemePayload(
  partial: Partial<ThemePayload> | Record<string, unknown>,
): ThemePayload {
  const p = partial as Partial<ThemePayload>;
  return {
    themeVersion: THEME_VERSION,
    colors: { ...defaultThemePayload.colors, ...p.colors },
    text: { ...defaultThemePayload.text, ...p.text },
    assets: mergeThemeAssets(p.assets),
  };
}
