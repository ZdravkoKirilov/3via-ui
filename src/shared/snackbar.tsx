import { Snackbar } from "@mui/material";
import { FC, useEffect, useState } from "react";

type Props = {
  open: boolean;
  children: JSX.Element;
};

export const ToggleSnackbar: FC<Props> = ({ open, children }) => {
  const [isOpen, setOpen] = useState(open);

  useEffect(() => {
    if (open) {
      setOpen(open);
    }
  }, [open]);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      onClose={() => setOpen(false)}
    >
      {children}
    </Snackbar>
  );
};
