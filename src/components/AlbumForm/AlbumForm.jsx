import { useState, useRef, useEffect } from "react";
import styles from "./AlbumForm.module.css";
export default function AlbumForm(props) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className={styles.albumFormContainer}>
      <form onSubmit={props.handleSubmit}>
        <label>Add an Album...</label>
        <input
          type="text"
          placeholder="Add an album..."
          ref={inputRef}
          value={props.albumName}
          onChange={(e) => props.setAlbumName(e.target.value)}
        />
        <div className={styles.albumFormButtons}>
          <button type="button" onClick={props.handleClear}>
            Clear
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
