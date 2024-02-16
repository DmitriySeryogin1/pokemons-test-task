import { Route, Routes } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Pokemon from "./pages/Pokemon";
import PokemonsList from "./pages/PokemonsList";

function App() {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<PokemonsList />} />
        <Route path="/:name" element={<Pokemon />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
