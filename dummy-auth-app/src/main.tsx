import { render } from "preact";
import { App } from "./app";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

render(
  <BrowserRouter basename="/app">
    <App />
  </BrowserRouter>,
  document.getElementById("app") as HTMLElement
);
