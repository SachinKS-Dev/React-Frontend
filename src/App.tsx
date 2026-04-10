import { useEffect, useState } from "react";
import SampleNotesDemo from "./sample/SampleNotesDemo";

export default function App() {
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
    <main className="main">
      <h1>React + Django (Docker)</h1>
      <p>
        API <code>/api/health/</code> via Vite proxy:{" "}
        <strong>{apiStatus}</strong>
      </p>

      <SampleNotesDemo />
    </main>
  );
}
