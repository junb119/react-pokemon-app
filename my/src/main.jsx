// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import App from "./practice/useRef_practice.jsx";
import ForwardRef from "./practice/forwardRef/forwardRef.jsx";
import NotUsePortal from "./practice/React_Portal/notUsePortal.jsx";
import UsePortal from "./practice/React_Portal/UsePortal.jsx";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UsePortal />
  // </StrictMode>,
);
