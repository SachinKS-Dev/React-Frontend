import { Link } from "react-router-dom";
import {
  Hero,
  MainLayout,
  Section,
  SiteFooter,
  SiteHeader,
} from "react-code-base";
import { StoreBrandLink } from "../components/StoreBrandLink.tsx";
import { useTheme } from "../theme/ThemeProvider.tsx";

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <MainLayout
      header={
        <SiteHeader
          brandSlot={<StoreBrandLink />}
          nav={
            <>
              <Link to="/sample" className="rcb-text-link">
                Sample demo
              </Link>
              <Link to="/admin/appearance" className="rcb-text-link">
                Appearance
              </Link>
            </>
          }
        />
      }
      footer={
        <SiteFooter>
          {theme.text.footerLegal ? (
            <span>{theme.text.footerLegal}</span>
          ) : (
            <span>
              Django + React (Docker). Shared UI from{" "}
              <code>react_code_base</code>.
            </span>
          )}
        </SiteFooter>
      }
    >
      <Hero
        title="Build full-stack apps with a clear split"
        subtitle={`${theme.text.tagline} — Django API and Vite React, wired for local Docker. Use the sample area to try CRUD against your backend.`}
        primaryCta={
          <Link
            to="/sample"
            className="rcb-button-link rcb-button-link--primary"
          >
            Open sample app
          </Link>
        }
      />
      <Section title="What you get">
        <p>
          A hybrid layout: run the API and UI in Compose, optional Devilbox for
          shared services, and reusable components in{" "}
          <code>react_code_base</code> so the same UI building blocks can ship
          in more than one product.
        </p>
      </Section>
    </MainLayout>
  );
}
