import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AppRouter from "./app/routes/AppRouter";
import { useAuthStore } from "./store/authStore";

function App() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <AppRouter />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;