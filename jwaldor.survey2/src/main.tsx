import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import CreateSurvey from "./routes/createsurvey";
import SurveySuccess from "./routes/surveysuccess";
import CompleteSurvey from "./routes/completesurvey";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { index: true, element: <Root /> },
      { path: "/create-survey", element: <CreateSurvey /> },
      { path: "/complete-survey/:id", element: <CompleteSurvey /> },
      { path: "/success", element: <SurveySuccess /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
