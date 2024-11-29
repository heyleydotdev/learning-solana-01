import "./main.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./_index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
