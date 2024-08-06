import { useState, useEffect } from "react";
import axios from "axios";
type Block = { blockId: string; new_questions: Array<String> };
function CreateSurvey() {
  const [blocks, setBlocks] = useState<Array<Block>>([]);
  const [title, setTitle] = useState("");
  const [surveyId, setSurveyId] = useState("");
  useEffect(() => {
    console.log("Running effect");
    axios
      .post("http://localhost:3000/initialize-survey", { title: title })
      .then((response) => {
        console.log("initializing survey", response.data.survey.id);
        setSurveyId(response.data.survey.id);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log("surveyId", surveyId);
  // useEffect(() => {
  //   console.log("effect running");
  //   axios
  //     .post("http://localhost:3000/initialize-survey", { title: title })
  //     .then((response) => console.log("response", response))
  //     .catch((error) => console.log(error));
  // }, [setTitle]);
  console.log("Create survey");
  function createBlock() {
    axios
      .post("http://localhost:3000/add-block", {
        survey_id: surveyId,
        ordering: blocks.length + 1,
      })
      .then((response) =>
        setBlocks(
          blocks.concat({ blockId: response.data.id, new_questions: [] })
        )
      );
    // newBlocks.push({});
  }
  const saveTitle: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("title", formData.get("title"));
    setTitle(title);
    axios
      .put("http://localhost:3000/update-survey-title", {
        id: surveyId,
        title: title,
      })
      .then((response) => {
        console.log("updating title", response.data.survey.id);
      })
      .catch((error) => console.log(error));
  };

  const saveQuestion: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData)
    console.log("question", formData.get("question"));
    const newBlocks = blocks.slice();
    newBlocks.find((element)=>element.)
    axios
      .put("http://localhost:3000/update-block", {
        id: surveyId,
        title: title,
      })
      .then((response) => {
        console.log("updating title", response.data.survey.id);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <h1>Let's create a survey</h1>
      <form onSubmit={saveTitle}>
        <input
          name="title"
          type="text"
          // value={currtitle}
          // onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button type="submit">Save</button>
      </form>
      {blocks.map((block: Block) => (
        <div key={block.blockId}>
          <br></br>
          {block.new_questions.map((question) => (
            <div>{question}</div>
          ))}
          <form onSubmit={saveTitle}>
            <input
              name="title"
              type="text"
              // value={currtitle}
              // onChange={(e) => setTitle(e.target.value)}
            ></input>
            <button data-block={block.blockId} type="submit">Add question</button>
          </form>
        </div>
      ))}
      <button  onClick={createBlock}>Add block</button>
    </>
  );
}

export default CreateSurvey;
