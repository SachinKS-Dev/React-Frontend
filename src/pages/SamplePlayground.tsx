import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AppShellTitle,
  MainLayout,
  SiteFooter,
  SiteHeader,
} from "react-code-base";
import { StoreBrandLink } from "../components/StoreBrandLink.tsx";
import SampleNotesDemo from "../sample/SampleNotesDemo";

export default function SamplePlayground() {
  const [apiStatus, setApiStatus] = useState<string>("loading…");

  useEffect(() => {
    fetch("/api/health/")
      .then((r) => r.json())
      .then((data: { status?: string }) =>
        setApiStatus(data.status ?? JSON.stringify(data)),
      )
      .catch(() => setApiStatus("error (is the backend up?)"));
  }, []);

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
              <Link to="/admin/appearance" className="rcb-text-link">
                Appearance
              </Link>
            </>
          }
        />
      }
      footer={
        <SiteFooter>
          <Link to="/" className="rcb-text-link">
            Back to landing
          </Link>
        </SiteFooter>
      }
    >
      <div className="main landing-root">
        <AppShellTitle>Sample playground</AppShellTitle>
        <p>
          API <code>/api/health/</code> via Vite proxy:{" "}
          <strong>{apiStatus}</strong>
        </p>
        <SampleNotesDemo />
      </div>
    </MainLayout>
  );
}
