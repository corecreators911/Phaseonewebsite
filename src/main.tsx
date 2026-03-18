import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import "./styles/index.css";

const rawBase = import.meta.env.BASE_URL || "/";
const normalizedBase = rawBase !== "/" ? rawBase.replace(/\/$/, "") : rawBase;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={normalizedBase}>
    <App />
  </BrowserRouter>
);