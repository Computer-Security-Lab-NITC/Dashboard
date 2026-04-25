import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { ToolsPage } from "./pages/ToolsPage";
import { WinnersPage } from "./pages/WinnersPage";
import { ArchivesPage } from "./pages/ArchivesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="announcement" element={<AnnouncementsPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="winners" element={<WinnersPage />} />
        <Route path="archives" element={<ArchivesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
