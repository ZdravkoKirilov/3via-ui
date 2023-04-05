import { pipe, sample } from "lodash/fp";

export type CreateAnswerDto = {
  title: string;
  points: number;
};

export type Answer = CreateAnswerDto & {
  id: number;
};

export type CreateQuestionDto = {
  title: string;
  hint?: string;
};

export type UpdateQuestionDto = CreateQuestionDto & {
  id: number;
  answers: Array<CreateAnswerDto | Answer>;
};

export type Question = Omit<UpdateQuestionDto, "answers"> & {
  answers: Answer[];

  createdAt: Date;
  updatedAt?: Date;
};

let questions = [] as Question[];
let currentQuestionId = 0;
let currentAnswerId = 0;

const getQuestions = () => {
  return questions;
};

const saveQuestions = (newQuestions: Question[]) => {
  questions = newQuestions;

  return newQuestions;
};

const addQuestion = (dto: CreateQuestionDto): Question => {
  currentQuestionId += 1;

  const newQuestion = {
    ...dto,
    id: currentQuestionId,
    createdAt: new Date(),
    answers: [],
  };

  questions.push(newQuestion);

  return newQuestion;
};

const editQuestion = (dto: UpdateQuestionDto): Question => {
  const existingQuestion = questions.find((question) => question.id === dto.id);

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  const updatedQuestion = {
    ...existingQuestion,
    ...dto,
    updatedAt: new Date(),
    answers: dto.answers.map((answer) => {
      currentAnswerId += 1;

      if (!("id" in answer)) {
        return {
          ...answer,
          id: currentAnswerId,
        };
      }

      return answer;
    }),
  };

  questions = questions.map((question) =>
    question.id === dto.id ? updatedQuestion : question
  );

  return updatedQuestion;
};

const deleteQuestion = (id: Question["id"]): void => {
  const existingQuestion = questions.find((question) => question.id === id);

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  questions = questions.filter((question) => question.id !== id);

  return undefined;
};

function withFail<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const result = sample([1, 2, 3, 4, 5, 6]);
    const shouldFail = result === 1;

    if (shouldFail) {
      throw new Error("Unexpected error");
    }

    return fn(...args);
  };
}

function withDelay<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const delay = sample([100, 300, 600, 1100, 2000]);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  };
}

const withDelayAndFailures = pipe(withDelay, withFail);

export const api = {
  addQuestion: withDelayAndFailures(addQuestion),
  getQuestions: withDelayAndFailures(getQuestions),
  editQuestion: withDelayAndFailures(editQuestion),
  deleteQuestion: withDelayAndFailures(deleteQuestion),
  saveQuestions: withDelayAndFailures(saveQuestions),
};
