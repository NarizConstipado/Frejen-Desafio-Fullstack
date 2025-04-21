import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AntimationRoutes from "./components/AnimationRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AntimationRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
