import { RouterProvider } from "react-router-dom";
import { AppProvider } from './context';
import { router } from "./utils/router";
import './index.css';

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router()} />
    </AppProvider>
  )
}

export default App
