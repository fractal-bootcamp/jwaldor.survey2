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
      console.log(response.data.survey);
    });
  }, []);

  //   console.log(surveylist);

  return (
    <>
      {surveys.map((survey: Survey) => (
        <ul>
          <li key={survey.id}>
            <a href={`complete-survey/${survey.id}`}>{survey.title}</a>
          </li>
        </ul>
      ))}
      {surveys.map((survey: Survey) => (
        <ul>
          <li key={survey.id}>
            <a href={`view-results/${survey.id}`}>{survey.title}</a>
          </li>
        </ul>
      ))}
    </>
  );
}

export default function Root() {
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    console.log("here");
    axios.get("http://localhost:3000/view-surveys").then((response) => {
      setSurveys(response.data.survey);
      console.log(response.data.survey);
    });
  }, []);
  return (
    <>
      <div id="sidebar">
        <Outlet />–<h1>Happy Surveys!</h1>
        <a href="create-survey">Create a survey!</a>
        <h1>Take a survey?</h1>
        {/* <SurveyList /> */}
        {surveys.map((survey: Survey) => (
          <ul>
            <li key={survey.id}>
              <a href={`complete-survey/${survey.id}`}>{survey.title}</a>
            </li>
          </ul>
        ))}
        <h1>View survey results!</h1>
        {surveys.map((survey: Survey) => (
          <ul>
            <li key={survey.id}>
              <a href={`view-results/${survey.id}`}>{survey.title}</a>
            </li>
          </ul>
        ))}
      </div>
      <div id="detail"></div>
    </>
  );
}
