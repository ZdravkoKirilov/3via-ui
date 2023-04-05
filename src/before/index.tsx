import { FC, useState } from "react";
import {
  AppBar,
  Container,
  Stack,
  Box,
  Typography,
  Fab,
  CircularProgress,
  Alert,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Close,
  Delete,
  Edit,
} from "@mui/icons-material";

import {
  Answer,
  CreateAnswerDto,
  CreateQuestionDto,
  Question,
  moveArrayItem,
  useQuestions,
} from "../helpers";
import {
  ToggleSnackbar,
  UpsertQuestionForm,
  CreateAnswerForm,
} from "../shared";

const InitialQuizForm: FC = () => {
  const { query, addQuestion, editQuestion, deleteQuestion, saveQuestions } =
    useQuestions();

  const [visibleCreateForm, toggleCreateForm] = useState(false);

  const [selectedQuestion, toggleSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  const [questionToDelete, setQuestionToDelete] = useState<
    undefined | Question["id"]
  >(undefined);

  const [pendingAnswer, setPendingAnswer] = useState<Question | undefined>(
    undefined
  );

  const [answerToDelete, setAnswerToDelete] = useState<
    { question: Question; answer: Answer["id"] } | undefined
  >(undefined);

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

  const handleAddQuestion = (dto: CreateQuestionDto) => {
    addQuestion.mutate(dto, {
      onSuccess: () => {
        toggleCreateForm(false);
      },
    });
  };

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

  const handleDeleteQuestion = () => {
    if (questionToDelete) {
      deleteQuestion.mutate(questionToDelete, {
        onSuccess: () => {
          setQuestionToDelete(undefined);
        },
      });
    }
  };

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

  const moveQuestion = (direction: "up" | "down", currentIndex: number) => {
    if (query.data) {
      const reorderedQuestions = moveArrayItem(
        query.data,
        currentIndex,
        direction === "up" ? currentIndex - 1 : currentIndex + 1
      );

      saveQuestions.mutate(reorderedQuestions);
    }
  };

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
              Questions {saveQuestions.isLoading && <CircularProgress />}
            </Typography>
            <Box>
              <Fab
                color="secondary"
                variant="extended"
                onClick={() => toggleCreateForm(true)}
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
              <Card key={question.id}>
                <Stack>
                  <Stack
                    sx={{ p: 2 }}
                    direction="row"
                    gap={5}
                    justifyContent="space-between"
                  >
                    <Stack gap={1}>
                      <Typography fontWeight="bold">
                        {question.title}{" "}
                        {editQuestion.isLoading &&
                          editQuestion.variables?.id === question.id && (
                            <CircularProgress />
                          )}
                      </Typography>
                      {question.hint && (
                        <Typography variant="subtitle2">
                          Hint: {question.hint}
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction="row" gap={3}>
                      <Box>
                        <Tooltip title="Edit question">
                          <IconButton
                            aria-label={`Edit question "${question.title}"`}
                            onClick={() => toggleSelectedQuestion(question)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Box>
                        <Tooltip title="Delete question">
                          <IconButton
                            aria-label={`Delete question "${question.title}"`}
                            onClick={() => setQuestionToDelete(question.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box>
                        <Tooltip title="Add answer">
                          <IconButton
                            aria-label={`Add answer to question "${question.title}"`}
                            onClick={() => setPendingAnswer(question)}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {questionIndex !== 0 && (
                        <Box>
                          <Tooltip title="Move question up">
                            <IconButton
                              aria-label="Move question up"
                              onClick={() => moveQuestion("up", questionIndex)}
                              disabled={saveQuestions.isLoading}
                            >
                              <ArrowUpward />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}

                      {questionIndex !== query.data.length - 1 && (
                        <Box>
                          <Tooltip title="Move question down">
                            <IconButton
                              aria-label="Move question down"
                              onClick={() =>
                                moveQuestion("down", questionIndex)
                              }
                              disabled={saveQuestions.isLoading}
                            >
                              <ArrowDownward />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Stack>
                  </Stack>

                  <Divider flexItem>Answers</Divider>

                  <Stack p={2} gap={2}>
                    {question.answers.length === 0 && (
                      <Alert severity="info">No answers yet.</Alert>
                    )}

                    {question.answers.map((answer, answerIndex) => (
                      <Card key={answer.id}>
                        <Stack
                          p={1}
                          gap={1}
                          direction="row"
                          alignItems="center"
                        >
                          <Typography>{answer.title}</Typography>

                          <Box flexGrow={1} />
                          <Typography>{answer.points} points</Typography>

                          <Tooltip title="Delete answer">
                            <IconButton
                              aria-label="Delete answer"
                              onClick={() =>
                                setAnswerToDelete({
                                  question,
                                  answer: answer.id,
                                })
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>

                          {answerIndex !== 0 && (
                            <Box>
                              <Tooltip title="Move answer up">
                                <IconButton
                                  aria-label="Move answer up"
                                  disabled={editQuestion.isLoading}
                                  onClick={() =>
                                    moveAnswer("up", answerIndex, question)
                                  }
                                >
                                  <ArrowUpward />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}

                          {answerIndex !== question.answers.length - 1 && (
                            <Box>
                              <Tooltip title="Move answer down">
                                <IconButton
                                  aria-label="Move answer down"
                                  disabled={editQuestion.isLoading}
                                  onClick={() =>
                                    moveAnswer("down", answerIndex, question)
                                  }
                                >
                                  <ArrowDownward />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>

          <Dialog open={visibleCreateForm} fullWidth>
            <DialogTitle>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Create a new question</Typography>
                <IconButton
                  aria-label="Close form"
                  onClick={() => toggleCreateForm(false)}
                >
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent>
              <Box p={2}>
                <UpsertQuestionForm
                  isLoading={addQuestion.isLoading}
                  error={addQuestion.error ? "Something went wrong" : ""}
                  onSubmit={handleAddQuestion}
                />
              </Box>
            </DialogContent>
          </Dialog>

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
                <Box>
                  <LoadingButton
                    color="warning"
                    variant="contained"
                    loading={editQuestion.isLoading}
                    onClick={handleDeleteAnswer}
                  >
                    Yes
                  </LoadingButton>
                </Box>

                {editQuestion.isError && (
                  <Alert severity="error">Something went wrong.</Alert>
                )}
              </Stack>
            </DialogContent>
          </Dialog>

          <ToggleSnackbar open={saveQuestions.isSuccess}>
            <Alert severity="success">Questions updated.</Alert>
          </ToggleSnackbar>

          <ToggleSnackbar open={saveQuestions.isError}>
            <Alert severity="error">Couldn't update questions.</Alert>
          </ToggleSnackbar>
        </Stack>
      </Container>
    </Box>
  );
};

export default InitialQuizForm;
