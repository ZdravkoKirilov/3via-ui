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

import { Question, useQuestions } from "../helpers";

export const useDeleteQuestion = () => {
  const { deleteQuestion } = useQuestions();

  const [questionToDelete, setQuestionToDelete] = useState<
    undefined | Question["id"]
  >(undefined);

  const handleDeleteQuestion = () => {
    if (questionToDelete) {
      deleteQuestion.mutate(questionToDelete, {
        onSuccess: () => {
          setQuestionToDelete(undefined);
        },
      });
    }
  };

  return {
    deleteQuestion: (id: Question["id"]) => setQuestionToDelete(id),

    DeleteQuestionUI: (
      <Dialog open={!!questionToDelete} fullWidth>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Delete question?</Typography>
            <IconButton
              aria-label="Close form"
              onClick={() => setQuestionToDelete(undefined)}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack p={2} gap={2}>
            <Box>
              <LoadingButton
                color="warning"
                variant="contained"
                loading={deleteQuestion.isLoading}
                onClick={handleDeleteQuestion}
              >
                Yes
              </LoadingButton>
            </Box>

            {deleteQuestion.isError && (
              <Alert severity="error">Something went wrong.</Alert>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    ),
  };
};
