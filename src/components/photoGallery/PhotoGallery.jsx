import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

import SearchBar from "../searchBar/SearchBar";
import FotoList from "../foto-fotoList/FotoList";
import FotoAmpliada from "../fotoAmpliada/FotoAmpliada";
import "./photoGallery.scss";

const IMAGES_PER_PAGE = 6;

const PhotoGallery = () => {
  const [fotos, setFotos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [activateSearch, setActivateSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY;

  const fetchImages = async (reset = false) => {
    const searchQuery = [query, categoria].filter(Boolean).join(" ");
    const endpoint = searchQuery
      ? "https://api.unsplash.com/search/photos"
      : "https://api.unsplash.com/photos";
    const params = {
      client_id: apiKey,
      page,
      per_page: IMAGES_PER_PAGE,
      query: searchQuery || undefined,
    };

    try {
      const res = await axios.get(endpoint, { params });
      const results = searchQuery ? res.data.results : res.data;
      setFotos(prev => (reset ? results : [...prev, ...results]));
      if (searchQuery) {
        setHasMore(page < res.data.total_pages);
      } else {
        setHasMore(results.length === IMAGES_PER_PAGE);
      }
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    }
  };

  // trigger de pesquisa
  useEffect(() => {
    if (activateSearch) {
      setPage(1);
      fetchImages(true);
      setActivateSearch(false);
    }
  }, [activateSearch]);

  // load more
  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page]);

  // busca inicial
  useEffect(() => {
    fetchImages(true);
  }, []);

  const handleLoadMore = () => setPage(prev => prev + 1);

  return (
    <div className="photo-gallery">
      <SearchBar
        setQuery={setQuery}
        setCategoria={setCategoria}
        setActivateSearch={setActivateSearch}
      />

      <FotoList fotos={fotos} setFotoAmpliada={setFotoAmpliada} />

      {hasMore && (
        <motion.button
          className="load-more"
          onClick={handleLoadMore}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowDown size={24} />
        </motion.button>
      )}

      {fotoAmpliada && (
        <FotoAmpliada
          foto={fotoAmpliada}
          setFotoAmpliada={setFotoAmpliada}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
