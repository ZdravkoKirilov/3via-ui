import { FC } from "react";
import {
  AppBar,
  Container,
  Stack,
  Box,
  Typography,
  Fab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { useQuestions } from "../helpers";
import { useCreateQuestion } from "./useCreateQuestion";
import { useEditQuestion } from "./useEditQuestion";
import { useDeleteQuestion } from "./useDeleteQuestion";
import { useCreateAnswer } from "./useCreateAnswer";
import { useDeleteAnswer } from "./useDeleteAnswer";
import { useMoveQuestion } from "./useMoveQuestion";
import { useMoveAnswer } from "./useMoveAnswer";
import QuestionCard from "./question";

const RefinedQuizForm: FC = () => {
  const { query, editQuestion } = useQuestions();

  const { createQuestion, CreateQuestionUI } = useCreateQuestion();
  const { editQuestion: showEditForm, EditQuestionUI } = useEditQuestion();
  const { deleteQuestion, DeleteQuestionUI } = useDeleteQuestion();
  const { showAnswerForm, CreateAnswerUI } = useCreateAnswer();
  const { deleteAnswer, DeleteAnswerUI, answerToDelete } = useDeleteAnswer();
  const {
    moveQuestion,
    FeedbackUI: SaveQuestionsFeedbackUI,
    isUpdatingQuestions,
  } = useMoveQuestion(query.data || []);
  const {
    moveAnswer,
    activeQuestion,
    FeedbackUI: MoveAnswerFeedbackUI,
  } = useMoveAnswer();

  if (query.isLoading) {
    return (
      <Stack>
        <CircularProgress />
        <Alert severity="info">Loading questions...</Alert>
      </Stack>
    );
  }

  if (query.isError) {
    return <Alert severity="error">Something went wrong.</Alert>;
  }

  return (
    <Box component="main">
      <AppBar sx={{ p: 2 }} position="static">
        <Typography variant="h4" component="h1" textAlign="center">
          3Via
        </Typography>
      </AppBar>

      <Container>
        <Stack gap={3} p={2}>
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            <Typography component="h2" variant="h5">
              Questions {isUpdatingQuestions && <CircularProgress />}
            </Typography>
            <Box>
              <Fab
                color="secondary"
                variant="extended"
                onClick={createQuestion}
              >
                <Add />
                Add
              </Fab>
            </Box>
          </Stack>

          <Stack gap={2}>
            {query.data.length === 0 && (
              <Alert severity="info">No questions yet.</Alert>
            )}

            {query.data.map((question, questionIndex) => (
              <QuestionCard
                key={question.id}
                question={question}
                isUpdating={
                  editQuestion.isLoading &&
                  editQuestion.variables?.id === question.id
                }
                isFirst={questionIndex === 0}
                isLast={questionIndex === query.data.length - 1}
                isUpdatingQuestions={isUpdatingQuestions}
                isUpdatingAnswers={
                  activeQuestion === question.id ||
                  answerToDelete === question.id
                }
                onEdit={() => showEditForm(question)}
                onDelete={() => deleteQuestion(question.id)}
                onAddAnswer={() => showAnswerForm(question)}
                onDeleteAnswer={(answer) =>
                  deleteAnswer({
                    question,
                    answer,
                  })
                }
                onMoveQuestion={(direction) =>
                  moveQuestion(direction, questionIndex)
                }
                onMoveAnswer={(direction, answerIndex) =>
                  moveAnswer(direction, answerIndex, question)
                }
              />
            ))}
          </Stack>

          {CreateQuestionUI}

          {EditQuestionUI}

          {DeleteQuestionUI}

          {CreateAnswerUI}

          {DeleteAnswerUI}

          {SaveQuestionsFeedbackUI}

          {MoveAnswerFeedbackUI}
        </Stack>
      </Container>
    </Box>
  );
};

export default RefinedQuizForm;
