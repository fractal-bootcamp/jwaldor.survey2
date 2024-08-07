import { useState, useEffect } from "react";
import axios from "axios";
type Block = { blockId: string; new_questions: Array<String> };
type SaveQuestion = { event: React.FormEvent<HTMLFormElement>; block: string };

function CreateSurvey() {
  const [blocks, setBlocks] = useState<Array<Block>>([]);
  const [title, setTitle] = useState("");
  const [surveyId, setSurveyId] = useState("");
  // const editing = blocks.map();
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
    console.log("creating block");
    axios
      .post("http://localhost:3000/add-block", {
        survey_id: surveyId,
        ordering: blocks.length + 1,
      })
      .then((response) => {
        console.log("blockresponse", response);
        console.log(response.data.theblock);
        setBlocks(
          blocks.concat({
            blockId: response.data.theblock.id,
            new_questions: [],
          })
        );
      })
      .catch((error) => console.log("error in block creation"));
    console.log(blocks);
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
  const saveQuestion = ({ event, block }: SaveQuestion) => {
    event.preventDefault();
    const newBlocks = blocks.slice();
    const formdata = new FormData(event.currentTarget);
    const qcontent = formdata.get("question");
    console.log("qcontent", qcontent, typeof qcontent);
    console.log(qcontent);
    console.log("saveQuestion");
    console.log("block", block);
    console.log(
      "new_questions",
      typeof newBlocks,
      newBlocks[0].new_questions,
      typeof newBlocks[0].new_questions
    );
    console.log(newBlocks);
    setBlocks(
      newBlocks.map((element) => {
        console.log("newBlcoks", element.blockId, block);
        if (element.blockId === block) {
          const mod_obj = {
            ...element,
            new_questions: element.new_questions.concat(qcontent),
          };
          axios
            .put("http://localhost:3000/update-block", mod_obj)
            .then((response) => {
              console.log("updating questions", response.data.question.id);
            })
            .catch((error) => console.log(error));
          return mod_obj;
        } else {
          return element;
        }
      })
    );
  };
  // const saveQuestion = (block: string) => {
  //   const newBlocks = blocks.slice();
  //   newBlocks.map((element) =>
  //     element.blockId === block
  //       ? { ...element, new_questions: element.new_questions.concat("") }
  //       : element
  //   );
  //   axios
  //     .put("http://localhost:3000/update-block", {
  //       id: surveyId,
  //       title: title,
  //     })
  //     .then((response) => {
  //       console.log("updating title", response.data.survey.id);
  //     })
  //     .catch((error) => console.log(error));
  // };
  console.log("blocks", blocks);
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
          {block.new_questions.map((question) => {
            console.log("question", question);
            return <div>{question}</div>;
          })}
          <form
            onSubmit={(event) =>
              saveQuestion({ event: event, block: block.blockId })
            }
          >
            <input
              name="question"
              type="text"
              // value={currtitle}
              // onChange={(e) => setTitle(e.target.value)}
            ></input>
            <button data-block={block.blockId} type="submit">
              Add question
            </button>
          </form>
        </div>
      ))}
      <button onClick={createBlock}>Add block</button>
    </>
  );
}

export default CreateSurvey;
