import { FC } from "react";

import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Edit,
} from "@mui/icons-material";

import { Answer, Question } from "../helpers";

type Props = {
  question: Question;
  isUpdating: boolean;
  isFirst: boolean;
  isLast: boolean;
  isUpdatingQuestions: boolean;
  isUpdatingAnswers: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddAnswer: () => void;
  onDeleteAnswer: (answerId: Answer["id"]) => void;
  onMoveQuestion: (direction: "up" | "down") => void;
  onMoveAnswer: (direction: "up" | "down", answerId: number) => void;
};

const QuestionCard: FC<Props> = ({
  question,
  isFirst,
  isLast,
  isUpdating,
  isUpdatingQuestions,
  isUpdatingAnswers,
  onEdit,
  onDelete,
  onAddAnswer,
  onDeleteAnswer,
  onMoveQuestion,
  onMoveAnswer,
}) => {
  return (
    <Card key={question.id}>
      <Stack>
        <Stack
          sx={{ p: 2 }}
          direction="row"
          gap={5}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack gap={1}>
            <Typography fontWeight="bold">
              {question.title}
              {(isUpdating || isUpdatingAnswers) && <CircularProgress />}
            </Typography>
            {question.hint && (
              <Typography variant="subtitle2">Hint: {question.hint}</Typography>
            )}
          </Stack>

          <Stack direction="row" gap={3}>
            <Box>
              <Tooltip title="Edit question">
                <IconButton
                  aria-label={`Edit question "${question.title}"`}
                  onClick={onEdit}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Tooltip title="Delete question">
                <IconButton
                  aria-label={`Delete question "${question.title}"`}
                  onClick={onDelete}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title="Add answer">
                <IconButton
                  aria-label={`Add answer to question "${question.title}"`}
                  onClick={onAddAnswer}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>

            {!isFirst && (
              <Box>
                <Tooltip title="Move question up">
                  <span>
                    <IconButton
                      aria-label="Move question up"
                      onClick={() => onMoveQuestion("up")}
                      disabled={isUpdatingQuestions}
                    >
                      <ArrowUpward />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}

            {!isLast && (
              <Box>
                <span>
                  <Tooltip title="Move question down">
                    <span>
                      <IconButton
                        aria-label="Move question down"
                        onClick={() => onMoveQuestion("down")}
                        disabled={isUpdatingQuestions}
                      >
                        <ArrowDownward />
                      </IconButton>
                    </span>
                  </Tooltip>
                </span>
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
                flexWrap="wrap"
              >
                <Typography>{answer.title}</Typography>

                <Box flexGrow={1} />
                <Typography>{answer.points} points</Typography>

                <Tooltip title="Delete answer">
                  <IconButton
                    aria-label="Delete answer"
                    onClick={() => onDeleteAnswer(answer.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>

                {answerIndex !== 0 && (
                  <Box>
                    <Tooltip title="Move answer up">
                      <IconButton
                        aria-label="Move answer up"
                        disabled={isUpdatingAnswers}
                        onClick={() => onMoveAnswer("up", answerIndex)}
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
                        disabled={isUpdatingAnswers}
                        onClick={() => onMoveAnswer("down", answerIndex)}
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
  );
};

export default QuestionCard;
