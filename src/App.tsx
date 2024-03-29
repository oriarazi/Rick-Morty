import RickAndMorty from "./routes/RickAndMorty";
import { useUser } from "./context/AuthContext";
import Login from "./routes/Login";
import "./App.scss";

const App: React.FC = () => {
  const { user } = useUser();

  const isLogged = !!user;

  return !isLogged ? <Login /> : <RickAndMorty />;
};

export default App;
