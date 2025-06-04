import { useState } from "react";
import styles from "./ImagesForm.module.css";

export default function ImagesForm(props) {
  return (
    <div className={styles.imageFormContainer}>
      <h2>Add an Image...</h2>
      <form onSubmit={props.imageFormHandleSubmit}>
        <label>Image Title</label>
        <input
          type="text"
          placeholder="Add a title..."
          value={props.title}
          onChange={(e) => {
            props.setTitle(e.target.value);
          }}
        />
        <label>Image URL</label>
        <input
          type="url"
          placeholder="Add a url..."
          value={props.url}
          onChange={(e) => {
            props.setURL(e.target.value);
          }}
        />
        <br />
        <div className={styles.imageFormButtons}>
          <button type="button" onClick={props.imageFormHandleClear}>
            Clear
          </button>
          <button>{props.willUpdate ? "Update" : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}
