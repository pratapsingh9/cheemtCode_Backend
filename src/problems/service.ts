import prismaCLient from "../utiils/prismaClient";

class QuestionService {
  static async createQuestion(
    topics: string[],
    title: string,
    exampleTestCase: string,
    description: string,
    difficulty: number,
    defaultCode: string
  ) {
    const question = await prismaCLient.question.create({
      data: {
        title: title,
        description: description,
        defaultCode: defaultCode,
        exampleTestCase: exampleTestCase,
        difficulty: difficulty,
        topics: topics,
      },
    });
    return question;
  }
  static async getQuestionById(questionId: number) {
    const question = await prismaCLient.question.findUnique({
      where: { id: questionId },
    });
    return question;
  }


  static async disconnect() {
    await prismaCLient.$disconnect();
  }
}
export default QuestionService;