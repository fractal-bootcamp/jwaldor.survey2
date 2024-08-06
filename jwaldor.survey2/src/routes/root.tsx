import axios from "axios";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

type Survey = { id: string; title: string };

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    console.log("here");
    axios.get("http://localhost:3000/view-surveys").then((response) => {
      setSurveys(response.data.survey);
    });
  }, []);

  //   console.log(surveylist);

  return (
    <>
      {surveys.map((survey: Survey) => (
        <ul>
          <li key={survey.id}>
            <a href={`http://localhost:3000/survey-questions/${survey.id}`}>
              {survey.title}
            </a>
          </li>
        </ul>
      ))}
    </>
  );
}

export default function Root() {
  return (
    <>
      <div id="sidebar">
        <Outlet />
        <h1>Happy Surveys!</h1>
        <h1>Take a survey?</h1>
        <SurveyList />
        <nav>
          <ul>
            <li>
              <a href={`/contacts/1`}>Your Name</a>
            </li>
            <li>
              <a href={`/contacts/2`}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail"></div>
    </>
  );
}
