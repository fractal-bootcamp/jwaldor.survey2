import axios from "axios";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

type Survey = { id: string; title: string };

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
        <div className="bg-slate-200 w-12 h-10 rounded-lg">
          <a href="create-survey">Create</a>
        </div>
        <h1>Take a survey?</h1>
        {/* <SurveyList /> */}
        {surveys.map((survey: Survey) => (
          <div key={survey.id}>
            {survey.title} <span> </span>
            <a href={`complete-survey/${survey.id}`}>take</a> <span> </span>
            <a href={`view-results/${survey.id}`}>results</a>
          </div>
        ))}
      </div>
      <div id="detail"></div>
    </>
  );
}
