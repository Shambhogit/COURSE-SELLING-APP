import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QywFUAtGfHEs5DuUSAiD190M6qHk3OMbhIVyB0FINosEAaWDrnCYiDznx7Ezsulgq0785kbhUlLX1VpdwTMG2aR00Y2odz27V"
);

createRoot(document.getElementById("root")).render(
  <Elements
    stripe={stripePromise}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
