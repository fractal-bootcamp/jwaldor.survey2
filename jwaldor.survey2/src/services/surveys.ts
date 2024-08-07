function getSurveyQuestions(questionId: string) {
  return client.get(`/questions/${questionId}`);
}
