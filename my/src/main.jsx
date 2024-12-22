// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import App from "./practice/useRef_practice.jsx";
import ForwardRef from "./practice/forwardRef.jsx";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
);
