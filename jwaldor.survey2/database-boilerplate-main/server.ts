import express, { Express, Request, Response } from "express";
import client from "client";

const app: Express = express();
const port = process.env.PORT || 3000;

let bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

  const responses = await client.responses.createMany({
    data: response_text.map((element, index) => ({
      text: element,
      question_id: question_ids[index],
    })),
  });
  console.log("responses", responses);

  res.json({ responses });
});

app.post("/add-block", async (req: Request, res: Response) => {
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
  const block_id = req.body.block_id;
  const deleted_questions = await client.question.deleteMany({
    where: { blockId: block_id },
  });
  console.log("deleted", deleted_questions);
  const with_block_id = req.body.new_questions.map((row: Object) => {
    return { ...row, blockId: block_id };
  });
  console.log("object saved", with_block_id);
  const new_questions = await client.question.createMany({
    data: with_block_id,
  });
  console.log("new_questions", new_questions);
  console.log(await client.question.findMany());
  res.json({ new_questions });
});

// const deleted_block = client.block.delete({ where: { id: block_id } });
// console.log("deleted_block", deleted_block);

app.get("/survey-questions/:survey_id", async (req: Request, res: Response) => {
  console.log("params", req.params);
  // const questions = await client.block.findMany({
  //   where: { surveyId: req.params.survey_id },include:{},
  // });
  console.log("survey questions");
  const blocks = await client.survey.findFirst({ include: { Blocks: true } });
  console.log(blocks);
  res.json({ Done: "done" });

  // const blocks = await client.block.findMany({
  //   where: { surveyId: req.params.survey_id },
  // });
  // console.log(blocks);

  // blocks.map(async (block) => {
  //   const questions = await client.question.findMany({
  //     where: { blockId: req.body.blockId },
  //   });
  //   console.log("questions", questions);
  //   questions.forEach((question) => {
  //     return {
  //       block_order: block.ordering,
  //       ordering: question.ordering,
  //       question_text: question.text,
  //       question_id: question.id,
  //     }
  //   });
  // });
  // console.log("blocked_questions", blocked_questions);
  // res.json(blocked_questions);
});

// app.get("/survey-responses/:survey_id", async (req: Request, res: Response) => {}){
//   const responses = await client.responses.findMany({
//     where: { surveyId: req.params.survey_id },
//   });
// };

app.delete("/block", async (req: Request, res: Response) => {});

// app.get("/", (req: Request, res: Response) => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(port, () => console.log("listening on port " + port));
