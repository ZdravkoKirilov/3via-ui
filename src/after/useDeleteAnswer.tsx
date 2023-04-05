import { useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { Answer, Question, useQuestions } from "../helpers";

type DeletePayload = {
  question: Question;
  answer: Answer["id"];
};

export const useDeleteAnswer = () => {
  const { editQuestion } = useQuestions();

  const [answerToDelete, setAnswerToDelete] = useState<
    DeletePayload | undefined
  >(undefined);

  const handleDeleteAnswer = () => {
    if (answerToDelete) {
      const updatedQuestion = {
        ...answerToDelete.question,
        answers: answerToDelete.question.answers.filter(
          (answer) => answer.id !== answerToDelete.answer
        ),
      };

      editQuestion.mutate(updatedQuestion, {
        onSuccess: () => {
          setAnswerToDelete(undefined);
        },
      });
    }
  };
  return {
    deleteAnswer: (payload: DeletePayload) => setAnswerToDelete(payload),
    answerToDelete: editQuestion.isLoading ? answerToDelete?.answer : null,
    DeleteAnswerUI: (
      <Dialog open={!!answerToDelete} fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Delete answer?</Typography>
            <IconButton
              aria-label="Close form"
              onClick={() => setAnswerToDelete(undefined)}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack p={2} gap={2}>
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                color="warning"
                variant="contained"
                loading={editQuestion.isLoading}
                onClick={handleDeleteAnswer}
              >
                Yes
              </LoadingButton>
            </Stack>

            {editQuestion.isError && (
              <Alert severity="error">Something went wrong.</Alert>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    ),
  };
};
