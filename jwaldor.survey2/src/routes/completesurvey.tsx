//clzjxhj7u003w1xwcao4jjg83

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import _ from "lodash";
// type Response = {
//   id: string;
//   text: string;
//   response_instance: string;
//   question_id: string;
// };

type Question = {
  id: string;
  text: string;
  ordering: string;
  Responses: Response[];
};

type Block = {
  id: string;
  ordering: string;
  surveyId: string;
  Question: Question[];
};

// type Results = {
//   id: string;
//   title: string;
//   Blocks: Block[];
// };

function CompleteSurvey() {
  console.log(useParams());
  const { id } = useParams();
  let [success, setSuccess] = useState(false);
  const [blocks, setBlocks] = useState<Array<Block>>([
    {
      id: "",
      ordering: "",
      surveyId: "",
      Question: [
        {
          id: "",
          text: "",
          ordering: "",
          Responses: [],
        },
      ],
    },
  ]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/survey-questions/${id}`)
      .then((response) => {
        console.log(response.data.all_questions);
        console.log("blocks", response.data.all_questions.Blocks[0].id);
        setBlocks(response.data.all_questions.Blocks);
        setTitle(response.data.all_questions.title);
        console.log(blocks, "questions");
        blocks.map((block) => {
          console.log("block", block);
        });
        // response.data.blocks.groupBy(({ block_order}) => block_order)
        // surveyFields = Object.groupBy(
        //   response.data.blocks,

        // );
      })
      .catch((error) => console.log(error));
  }, []);
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("response", formData.get("response"));
    // for (const value of formData.values()) {
    //   console.log(value);
    // }
    const answer_obj: { question_ids: Array<string>; text: Array<string> } = {
      question_ids: [],
      text: [],
    };
    for (const key of formData.keys()) {
      console.log("key", key);
      console.log(formData.get(key));
      answer_obj.question_ids.push(key);
      answer_obj.text.push(formData.get(key) as string);
      console.log(formData.get(key));
    }
    console.log("answer_obj", answer_obj);
    // console.log(k.next());
    // console.log(k.next());
    // console.log(k.next());
    axios
      .post("http://localhost:3000/answer-survey-questions", answer_obj)
      .then((response) => {
        console.log("sent request");
        console.log(response.data);
      })
      .catch((error) => console.log(error));
    setSuccess(true);
  };
  console.log("surveyId", id);
  //   const [responses, setResponses] = useState<Array<Block>>([]);
  return (
    <>
      {success ? (
        <div>Success!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>{title}</h1>
          {blocks.map((block) => (
            <div key={block.id}>
              <br></br>
              {block.Question.map((q) => (
                <div key={q.id}>
                  {q.text}

                  <input name={q.id} type="text"></input>
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}

export default CompleteSurvey;

// block_order: block.ordering,
// ordering: question.ordering,
// question_text: question.text,
// question_id: question.id,

{
  /* <form
onSubmit={(event) =>
  
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
</form> */
}
