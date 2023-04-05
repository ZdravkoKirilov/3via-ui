import { Alert } from "@mui/material";
import { Question, moveArrayItem, useQuestions } from "../helpers";
import { ToggleSnackbar } from "../shared";

export const useMoveQuestion = (currentQuestions: Question[]) => {
  const { saveQuestions } = useQuestions();

  const moveQuestion = (direction: "up" | "down", currentIndex: number) => {
    const reorderedQuestions = moveArrayItem(
      currentQuestions,
      currentIndex,
      direction === "up" ? currentIndex - 1 : currentIndex + 1
    );

    saveQuestions.mutate(reorderedQuestions);
  };

  return {
    moveQuestion,
    isUpdatingQuestions: saveQuestions.isLoading,
    FeedbackUI: (
      <>
        <ToggleSnackbar open={saveQuestions.isSuccess}>
          <Alert severity="success">Questions updated.</Alert>
        </ToggleSnackbar>

        <ToggleSnackbar open={saveQuestions.isError}>
          <Alert severity="error">Couldn't update questions.</Alert>
        </ToggleSnackbar>
      </>
    ),
  };
};
