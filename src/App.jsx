import HomePage from "./assets/pages/HomePage";
import { HashRouter, Route, Routes } from "react-router-dom";
import MatchPage from "./assets/pages/MatchPage";
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </HashRouter>
  );
}
