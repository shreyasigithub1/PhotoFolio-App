import React, { useState, useEffect, useRef } from "react";
import styles from "./Carousel.module.css";
//importing toast object
import { toast } from "react-toastify";

export default function Carousel({ images, onDelete, onUpdate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const currentImage = images[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  //To search Imagea
  function searchImage(e) {
    e.preventDefault();
    console.log(images);
    console.log(searchInput);
    images.map((image, index) => {
      if (searchInput == image.title.trim()) {
        setCurrentIndex(index);
        console.log(currentIndex);
      }
    });
  }
  return (
    <>
      {currentImage ? (
        <>
          {" "}
          <div className={styles.wholeCarousetContainer}>
            <div className={styles.searchContainer}>
              <form onSubmit={searchImage}>
                <label>Search Image</label>
                <input
                  type="text"
                  placeholder="Search for an image.."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                />
                <button>Search</button>
              </form>
            </div>
            <div className={styles.carouselContainer}>
              <div className={styles.imageBox}>
                <img src={currentImage.url} alt={currentImage.title} />
              </div>
              <div className={styles.title}>{currentImage.title}</div>

              <div className={styles.navButtons}>
                <button className={styles.button} onClick={goPrev}>
                  Previous
                </button>
                <button className={styles.button} onClick={goNext}>
                  Next
                </button>
              </div>

              <div className={styles.actionButtons}>
                <span
                  className="material-symbols-outlined"
                  onClick={() => onDelete(currentIndex)}
                >
                  delete
                </span>
                <span
                  className="material-symbols-outlined"
                  onClick={() => onUpdate(currentIndex)}
                >
                  edit_note
                </span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
