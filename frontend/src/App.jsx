import { Toaster } from 'react-hot-toast';
import AppRouter from './app/routes/AppRouter';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
