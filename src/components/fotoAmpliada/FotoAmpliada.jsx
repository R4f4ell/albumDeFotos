import { X, Heart, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './fotoAmpliada.scss';

const FotoAmpliada = ({ foto, setFotoAmpliada }) => {
  const [liked, setLiked] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleClose = () => {
    setFotoAmpliada(null);
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return; // só desktop

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return;
    imageRef.current.style.transform = 'scale(2)';
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    imageRef.current.style.transform = 'scale(1)';
    imageRef.current.style.transformOrigin = 'center center';
  };

  return (
    <div className="foto-ampliada-backdrop" onClick={handleClose}>
      <div className="foto-ampliada-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X />
        </button>

        <img
          ref={imageRef}
          src={foto.urls.regular}
          alt={foto.alt_description}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        <div className="modal-actions">
          <button className="like-btn" onClick={handleLike}>
            <Heart fill={liked ? '#ff0000' : 'none'} color={liked ? '#ff0000' : '#fff'} />
          </button>

          <a
            className="download-btn"
            href={foto.urls.full}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Download />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FotoAmpliada;