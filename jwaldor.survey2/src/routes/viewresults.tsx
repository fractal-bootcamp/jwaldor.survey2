//clzjxhj7u003w1xwcao4jjg83

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import _ from "lodash";

type Response = {
  id: string;
  text: string;
  response_instance: string;
  question_id: string;
};

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

type Results = {
  id: string;
  title: string;
  Blocks: Block[];
}; //[{"id":"clzk69e4q0012it6nnm8jgfb3","ordering":1,"surveyId":"clzk69do90010it6n13nc3h1b","Question":[{"id":"clzk6mmah0000glng2j4erdea","text":"Hello","ordering":0,"blockId":"clzk69e4q0012it6nnm8jgfb3","Responses":[{"id":"clzk6odog00013gske80dwo84","text":"here","response_instance":"clzk6odob00003gskko75qmko","question_id":"clzk6mmah0000glng2j4erdea"}]},{"id":"clzk6mmah0001glng0uda623m","text":"Hello","ordering":1,"blockId":"clzk69e4q0012it6nnm8jgfb3","Responses":[{"id":"clzk6odog00023gsk4ml63gjf","text":"there","response_instance":"clzk6odob00003gskko75qmko","question_id":"clzk6mmah0001glng0uda623m"}]}]}]
function ViewResults() {
  console.log(useParams());
  const { id } = useParams();
  const [results, setResults] = useState<Results>({
    id: "",
    title: "",
    Blocks: [],
  });
  // const [force, setForce] = useState(0);
  // let results: Results = { id: "", title: "", Blocks: [] };
  useEffect(() => {
    axios
      .get(`http://localhost:3000/survey-results/${id}`)
      .then((response) => {
        console.log("survey results", response);
        console.log(response.data.results);
        setResults(response.data.results);
      })
      .catch((error) => console.log(error, "error in block creation"));
  }, []);
  console.log("results");
  console.log("blocks", results.Blocks);
  console.log("id", results.id);
  return (
    <>
      <div>Results for {results.title}</div>
      <div>
        {results.Blocks.map((blocks) =>
          blocks.Question.map((question) => (
            <div>
              {question.text}{" "}
              {question.Responses.map((response) => (
                <div>
                  {response.response_instance} {response.text}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ViewResults;

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
