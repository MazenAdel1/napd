import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { DirectionProvider } from "./components/ui/direction.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DirectionProvider dir="rtl">
        <App />
      </DirectionProvider>
    </BrowserRouter>
  </StrictMode>,
);
