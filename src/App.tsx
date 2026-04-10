import { Link, Route, Routes } from "react-router-dom";
import AppearancePage from "./pages/AppearancePage";
import LandingPage from "./pages/LandingPage";
import SamplePlayground from "./pages/SamplePlayground";

function NotFound() {
  return (
    <div className="main landing-root">
      <h1>Not found</h1>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sample" element={<SamplePlayground />} />
      <Route path="/admin/appearance" element={<AppearancePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
