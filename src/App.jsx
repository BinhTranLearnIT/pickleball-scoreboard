import HomePage from "./assets/pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MatchPage from "./assets/pages/MatchPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/match" element={<MatchPage />} />
        {/* <Route path="/templates" element={<Templates />} />
        <Route path="/edit" element={<EditPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
