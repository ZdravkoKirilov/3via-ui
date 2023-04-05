import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import QuizForm from "./after";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <QuizForm />
    </QueryClientProvider>
  );
}

export default App;
