import { RouterProvider } from "react-router";

import { router } from "@/lib/router";
import { QueryProvider } from "@/providers/QueryProvider";

const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};

export default App;
