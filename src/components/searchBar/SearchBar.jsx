import { useState } from "react";
import { Search, List } from "lucide-react";
import { motion } from "framer-motion";
import './searchBar.scss';

const SearchBar = ({ setQuery, setCategoria, setActivateSearch }) => {
  const [localQuery, setLocalQuery] = useState("");
  const categorias = [
    "Natureza",
    "Pessoas",
    "Tecnologia",
    "Animais",
    "Esportes",
  ];

  const handleSearch = () => {
    setQuery(localQuery);
    setActivateSearch(true);
  };

  return (
    <motion.div
      className="search-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="input-wrapper">
        <Search className="icon" size={18} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Pesquisar fotos..."
        />
      </div>

      <button onClick={handleSearch}>
        <Search size={18} style={{ marginRight: "6px" }} />
        Pesquisar
      </button>

      <div className="select-wrapper">
        <List className="icon" size={18} />
        <select
          onChange={(e) => {
            setCategoria(e.target.value);
            setActivateSearch(true);
          }}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default SearchBar;
