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

import { CreateQuestionDto, Question, useQuestions } from "../helpers";
import { UpsertQuestionForm } from "../shared";

export const useEditQuestion = () => {
  const { editQuestion } = useQuestions();

  const [selectedQuestion, toggleSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  const handleEditQuestion = (dto: CreateQuestionDto) => {
    if (selectedQuestion) {
      editQuestion.mutate(
        {
          ...selectedQuestion,
          ...dto,
        },
        {
          onSuccess: () => {
            toggleSelectedQuestion(undefined);
          },
        }
      );
    }
  };

  return {
    editQuestion: (question: Question) => toggleSelectedQuestion(question),

    EditQuestionUI: (
      <Dialog open={!!selectedQuestion} fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Edit question</Typography>
            <IconButton
              aria-label="Close form"
              onClick={() => toggleSelectedQuestion(undefined)}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box p={2}>
            <UpsertQuestionForm
              isLoading={editQuestion.isLoading}
              error={editQuestion.error ? "Something went wrong" : ""}
              onSubmit={handleEditQuestion}
              question={selectedQuestion}
            />
          </Box>
        </DialogContent>
      </Dialog>
    ),
  };
};
