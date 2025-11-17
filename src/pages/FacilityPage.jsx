import React, { useState, useEffect } from 'react';
import { ApiServices } from '../services/ApiServices';
import '../css/FacilityPage.css';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/imageUtils';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="facility-image-placeholder">
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div className="slider-main">
        <button className="slider-arrow left" onClick={goToPrevious}>
          ‹
        </button>
        <img 
          src={getImageUrl(images[currentIndex].image_url || images[currentIndex])} 
          alt="facility" 
          className="slider-image"
        />
        <button className="slider-arrow right" onClick={goToNext}>
          ›
        </button>
      </div>
      <div className="slider-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

const FacilityCard = ({ facility }) => {
  const images = facility.images || [];
  
  return (
    <div className="facility-card">
      <ImageSlider images={images} />
      <div className="facility-content">
        <h3 className="facility-title">{facility.name}</h3>
        <p className="facility-description">{facility.description}</p>
       
      </div>
    </div>
  );
};

const FacilityPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await ApiServices.getFacilities();
        setFacilities(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch facilities. Please try again later.');
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Error! </strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="facility-page pt-8">
     
     <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">Cơ sở vật chất</h3>
      <div className="facility-list">
        {facilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>

      {facilities.length === 0 && (
        <div className="no-facilities">
          <h3>No facilities available at the moment.</h3>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FacilityPage;