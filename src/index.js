import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import "moment/locale/pl";
import "moment/locale/en-gb";

import "./utils/i18n/i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
