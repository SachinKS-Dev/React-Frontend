import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider.tsx";

type Props = {
  className?: string;
  children?: ReactNode;
};

/**
 * Header brand: logo from theme when valid URL loads; otherwise `storeName` text.
 */
export function StoreBrandLink({ className, children }: Props) {
  const { theme } = useTheme();
  const url = theme.assets.logoUrl;
  const [logoOk, setLogoOk] = useState(Boolean(url));

  useEffect(() => {
    setLogoOk(Boolean(url));
  }, [url]);

  return (
    <Link
      to="/"
      aria-label={theme.text.storeName}
      className={className ?? "rcb-site-header__brand inline-flex items-center gap-2"}
    >
      {url && logoOk ? (
        <img
          src={url}
          alt=""
          className="h-8 w-auto max-w-[10rem] object-contain object-left"
          onError={() => setLogoOk(false)}
        />
      ) : null}
      {(!url || !logoOk) && (
        <span>{children ?? theme.text.storeName}</span>
      )}
    </Link>
  );
}
