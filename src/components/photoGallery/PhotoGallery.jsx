import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

import SearchBar from "../searchBar/SearchBar";
import FotoList from "../foto-fotoList/FotoList";
import FotoAmpliada from "../fotoAmpliada/FotoAmpliada";

import { useDebounce } from "../../hooks/useDebounce";
import { useInteractedPhotos } from "../../hooks/useInteractedPhotos";
import { useFilteredPhotos } from "../../hooks/useFilteredPhotos";

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
  const debouncedQuery = useDebounce(query, 400);
  const interactedPhotos = useInteractedPhotos(categoria, apiKey);

  const fotosExibidas = useFilteredPhotos({
    fotos,
    categoria,
    query: debouncedQuery,
    interactedPhotos,
  });

  const fetchImages = async (reset = false) => {
    const isFilter = categoria === "liked" || categoria === "downloaded";
    const searchQuery = isFilter
      ? ""
      : [debouncedQuery, categoria].filter(Boolean).join(" ");
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
      setFotos((prev) => {
        if (reset) return results;
        const prevIds = new Set(prev.map((f) => f.id));
        const unique = results.filter((f) => !prevIds.has(f.id));
        return [...prev, ...unique];
      });
      if (!isFilter) {
        setHasMore(
          searchQuery
            ? page < res.data.total_pages
            : results.length === IMAGES_PER_PAGE
        );
      }
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    }
  };

  useEffect(() => {
    if (activateSearch) {
      if (!["liked", "downloaded"].includes(categoria)) {
        setPage(1);
        fetchImages(true);
      }
      setActivateSearch(false);
    }
  }, [activateSearch]);

  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page]);

  useEffect(() => {
    fetchImages(true);
  }, []);

  // Quando categoria muda para liked/downloaded, garante re-render imediato
  useEffect(() => {
    // dispara render ao mudar categoria, sem reload
  }, [categoria]);

  const handleLoadMore = () => setPage((p) => p + 1);

  return (
    <div className="photo-gallery">
      <SearchBar
        setQuery={setQuery}
        setCategoria={setCategoria}
        setActivateSearch={setActivateSearch}
      />

      {(["liked", "downloaded"].includes(categoria) && fotosExibidas.length === 0) ? (
        <p className="empty-message">Nada por aqui. Curta ou baixe algumas imagens primeiro!</p>
      ) : (
        <FotoList fotos={fotosExibidas} setFotoAmpliada={setFotoAmpliada} />
      )}

      {!(["liked", "downloaded"].includes(categoria)) && hasMore && (
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
        <FotoAmpliada foto={fotoAmpliada} setFotoAmpliada={setFotoAmpliada} />
      )}
    </div>
  );
};

export default PhotoGallery;