import { Alert } from "@mui/material";
import { Question, moveArrayItem, useQuestions } from "../helpers";
import { ToggleSnackbar } from "../shared";

export const useMoveAnswer = () => {
  const { editQuestion } = useQuestions();

  const moveAnswer = (
    direction: "up" | "down",
    currentIndex: number,
    question: Question
  ) => {
    const reorderedAnswers = moveArrayItem(
      question.answers,
      currentIndex,
      direction === "up" ? currentIndex - 1 : currentIndex + 1
    );

    const updatedQuestion = {
      ...question,
      answers: reorderedAnswers,
    };

    editQuestion.mutate(updatedQuestion);
  };

  return {
    moveAnswer,
    activeQuestion: editQuestion.isLoading ? editQuestion.variables?.id : null,
    FeedbackUI: (
      <>
        <ToggleSnackbar open={editQuestion.isSuccess}>
          <Alert severity="success">Answers updated.</Alert>
        </ToggleSnackbar>

        <ToggleSnackbar open={editQuestion.isError}>
          <Alert severity="error">Couldn't update answers.</Alert>
        </ToggleSnackbar>
      </>
    ),
  };
};
