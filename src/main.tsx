import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "../node_modules/bec-react-components/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import { App } from "./App.tsx";

import "./utils/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
