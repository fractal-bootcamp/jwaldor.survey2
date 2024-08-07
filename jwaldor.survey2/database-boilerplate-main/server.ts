import express, { Express, Request, Response } from "express";
import client from "client";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3000;

let bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  console.log("test hello 2");
  res.send("Hello World!");
});

app.post("/initialize-survey", async (req: Request, res: Response) => {
  console.log("blah blah");
  console.log("req", req);
  console.log("req.body", req.body);
  console.log("done");
  console.log("all", client.survey.findMany());
  const survey = await client.survey.create({
    data: { title: req.body.title },
  });

  res.json({ survey });
});

app.put("/update-survey-title", async (req: Request, res: Response) => {
  console.log("blah blah");
  console.log("req", req);
  console.log("req.body", req.body);
  console.log("done");
  console.log("all", client.survey.findMany());
  const survey = await client.survey.update({
    where: {
      id: req.body.id,
    },
    data: { title: req.body.title },
  });

  res.json({ survey });
});

app.get("/view-surveys", async (req: Request, res: Response) => {
  console.log("req", req);
  console.log("req.body", req.body);
  console.log("done");
  console.log("all", client.survey.findMany());
  const survey = await client.survey.findMany();

  res.json({ survey });
});

app.post("/answer-survey-questions", async (req: Request, res: Response) => {
  const question_ids = req.body.question_ids;
  const response_text: string[] = req.body.text;
  console.log("req.body", req.body);
  const response_instance = await client.surveyResponse.create({ data: {} });
  console.log("response_instance", response_instance);
  const responses = await client.responses.createMany({
    data: response_text.map((element, index) => ({
      response_instance: response_instance.id,
      text: element,
      question_id: question_ids[index],
    })),
  });
  console.log("responses", responses);

  res.json({ responses });
});

app.post("/add-block", async (req: Request, res: Response) => {
  console.log("survey ID", req.body.survey_id);
  const theblock = await client.block.create({
    data: { ordering: req.body.ordering, surveyId: req.body.survey_id },
  });
  console.log(theblock);
  res.json({ theblock });
  console.log(client.block.findMany());
});

app.put("/update-block", async (req: Request, res: Response) => {
  //
  console.log("updating block");
  const block_id = req.body.blockId;
  const deleted_questions = await client.question.deleteMany({
    where: { blockId: block_id },
  });
  console.log("req.body", req.body);
  console.log("new questions", req.body.new_questions);
  console.log("deleted", deleted_questions);
  const with_block_id = req.body.new_questions.map(
    (row: string, index: number) => {
      return { text: row, blockId: block_id, ordering: index };
    }
  );
  console.log("object saved", with_block_id);
  const new_questions = await client.question.createMany({
    data: with_block_id,
  });
  console.log("new_questions", new_questions);
  res.json({ new_questions });
});

// const deleted_block = client.block.delete({ where: { id: block_id } });
// console.log("deleted_block", deleted_block);

app.get("/survey-questions/:survey_id", async (req: Request, res: Response) => {
  console.log("params", req.params);
  // const questions = await client.block.findMany({
  //   where: { surveyId: req.params.survey_id },include:{},
  // });
  // console.log("survey questions");
  // const blockid = ""
  // const questions = await client.question.findMany(where:{blockId:blockid}})
  // const blocks = await client.survey.findFirst({
  //   where: { id: req.params.survey_id },
  //   select: {
  //     Blocks: {
  //       select: {
  //         Question: true,
  //       },
  //     },
  //   },
  // });
  // console.log(blocks);
  // console.log(blocks?.Blocks[0].Question[0]);
  // //{ select: { ordering: true, text: true, id: true } },
  // res.json({ Done: "done" });

  // const questions = await client.question.findMany({where:{surveyId: req.params.survey_id}})

  const all_questions = await client.survey.findFirst({
    where: { id: req.params.survey_id },
    include: { Blocks: { include: { Question: true } } },
  });
  console.log("all_questions", all_questions);
  if (all_questions) {
    all_questions.Blocks.sort((a, b) => a.ordering - b.ordering);
    all_questions.Blocks.forEach((block) =>
      block.Question.sort((a, b) => a.ordering - b.ordering)
    );
    res.json({ all_questions });
  } else {
    res.json({});
  }
});

// app.get("/survey-responses/:survey_id", async (req: Request, res: Response) => {}){
//   const responses = await client.responses.findMany({
//     where: { surveyId: req.params.survey_id },
//   });
// };

app.delete("/block/:block_id", async (req: Request, res: Response) => {
  console.log(req.params.block_id);
  const deleteQuestions = await client.question.deleteMany({
    where: {
      blockId: { equals: req.params.block_id },
    },
  });
  const deleteBlock = await client.block.delete({
    where: {
      id: req.params.block_id,
    },
  });
  console.log("done deleting");
  res.json({ deleteBlock, deleteQuestions });
});

app.get("/survey-results/:survey_id", async (req: Request, res: Response) => {
  console.log("params", req.params);
  const results = await client.survey.findFirst({
    where: { id: req.params.survey_id },
    include: {
      Blocks: { include: { Question: { include: { Responses: true } } } },
    },
  });
  console.log("results", results);
  if (results) {
    results.Blocks.sort((a, b) => a.ordering - b.ordering);
    results.Blocks.forEach((block) => {
      block.Question.sort((a, b) => a.ordering - b.ordering);
      block.Question.forEach((question) =>
        question.Responses.sort((a, b) => a.id.localeCompare(b.id))
      );
    });
    res.json({ results });
  } else {
    res.json({});
  }
});

// app.get("/", (req: Request, res: Response) => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(port, () => console.log("listening on port " + port));
