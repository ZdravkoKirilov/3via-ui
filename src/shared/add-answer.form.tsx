import { FC } from "react";
import { useForm } from "react-hook-form";
import { Alert, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { CreateAnswerDto } from "../helpers";

type Props = {
  isLoading: boolean;
  onSubmit: (payload: CreateAnswerDto) => void;
  error?: string;
};

export const CreateAnswerForm: FC<Props> = ({ isLoading, error, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnswerDto>();

  const onSubmitHandler = (payload: CreateAnswerDto) => {
    onSubmit(payload);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmitHandler)} gap={3}>
      <TextField
        fullWidth
        aria-required
        id="title"
        name="title"
        label="Title"
        inputProps={{ ...register("title", { required: true }) }}
        helperText={errors.title?.message || ""}
        error={!!errors.title?.message}
        aria-invalid={!!errors.title?.message}
      />

      <TextField
        fullWidth
        aria-required
        id="points"
        name="points"
        label="Points"
        type="number"
        inputProps={{ ...register("points", { required: true }) }}
        helperText={errors.points?.message || ""}
        error={!!errors.points?.message}
        aria-invalid={!!errors.points?.message}
      />

      <LoadingButton loading={isLoading} variant="contained" type="submit">
        Submit
      </LoadingButton>

      {error && <Alert severity="error">Something went wrong.</Alert>}
    </Stack>
  );
};
