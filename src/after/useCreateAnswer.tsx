import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { CreateAnswerDto, Question, useQuestions } from "../helpers";
import { CreateAnswerForm } from "../shared";

export const useCreateAnswer = () => {
  const { editQuestion } = useQuestions();
  const [pendingAnswer, setPendingAnswer] = useState<Question | undefined>(
    undefined
  );

  const handleAddAnswer = (answer: CreateAnswerDto) => {
    if (pendingAnswer) {
      const updatedQuestion = {
        ...pendingAnswer,
        answers: [...pendingAnswer.answers, answer],
      };

      editQuestion.mutate(updatedQuestion, {
        onSuccess: () => {
          setPendingAnswer(undefined);
        },
      });
    }
  };

  return {
    showAnswerForm: (question: Question) => setPendingAnswer(question),

    CreateAnswerUI: (
      <Dialog open={!!pendingAnswer} fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Add answer</Typography>
            <IconButton
              aria-label="Close form"
              onClick={() => setPendingAnswer(undefined)}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box p={2}>
            <CreateAnswerForm
              isLoading={editQuestion.isLoading}
              error={editQuestion.error ? "Something went wrong" : ""}
              onSubmit={handleAddAnswer}
            />
          </Box>
        </DialogContent>
      </Dialog>
    ),
  };
};
