import styles from "./ImagesList.module.css";
import { db } from "../../firebaseInit";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  getDocs,
  where,
  query,
  getDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import ImagesForm from "../ImageForm/ImagesForm";
import AlbumList from "../AlbumList/AlbumList";
import Carousel from "../Carousel/Carousel";
//importing toast object
import { toast } from "react-toastify";

export default function ImagesList(props) {
  //Save all the retrieved images here
  const [imageArray, setImageArray] = useState([]);
  const [showImageForm, setShowImageForm] = useState(false);
  //the value of url to be extracted from ImagesForm
  const [url, setURL] = useState("");
  //the value of title to be extracted from ImagesForm
  const [title, setTitle] = useState("");
  //Update or not
  const [willUpdate, setWillUpdate] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(null);
  const [showAlbumList, setShowAlbumList] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const noImagesToastShown = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "albums"), (snapshot) => {
      const albumsArray = [];

      snapshot.forEach((doc) => {
        albumsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      props.setAlbumData(albumsArray);

      const selectedAlbum = albumsArray.find(
        (album) => album.id === props.selectedAlbum
      );

      const selectedImages = selectedAlbum?.images || [];

      setImageArray(selectedImages);

      if (selectedImages.length === 0 && !noImagesToastShown.current) {
        toast.info("No images to display!", {
          style: {
            backgroundColor: "#e85d04",
            color: "#fff",
            fontWeight: "bold",
          },
        });
        noImagesToastShown.current = true; // prevent repeated toasts
      } else if (selectedImages.length > 0) {
        noImagesToastShown.current = false; // reset if images exist
      }
    });

    return () => unsubscribe();
  }, [props.selectedAlbum]);

  useEffect(() => {
    const selectedAlbumObj = props.albumData.find(
      (album) => album.id === props.selectedAlbum
    );

    if (selectedAlbumObj) {
      setAlbumName(selectedAlbumObj.name);
    } else {
      setAlbumName("Unknown Album");
    }
  }, [props.albumData, props.selectedAlbum]);

  async function imageFormHandleSubmit(e) {
    e.preventDefault();
    const albumDocRef = doc(db, "albums", props.selectedAlbum);
    const docSnap = await getDoc(albumDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const images = data.images || [];

      if (willUpdate && updateIndex !== null) {
        images[updateIndex] = { title, url };

        await updateDoc(albumDocRef, { images: images });

        toast.success("Image updated!", {
          style: {
            backgroundColor: "#e85d04",
            color: "#fff",
            fontWeight: "bold",
          },
        });

        setWillUpdate(false);
        setUpdateIndex(null);
      } else {
        images.push({ title, url });

        await updateDoc(albumDocRef, { images: images });

        toast.success("Image added!", {
          style: {
            backgroundColor: "#e85d04",
            color: "#fff",
            fontWeight: "bold",
          },
        });
      }

      console.log("Image saved");
      setTitle("");
      setURL("");
      console.log(props.albumData);
    }
  }

  function imageFormHandleClear() {
    setTitle("");
    setURL("");
  }

  //handleUpdate
  async function handleUpdate(index) {
    console.log("update clicked");
    setWillUpdate(true);

    // Prefill the form fields
    const newImageArray = imageArray[index];
    setTitle(newImageArray.title);
    setURL(newImageArray.url);
    setUpdateIndex(index);
    setShowImageForm(true);
  }
  //handleDelete
  async function handleDelete(indexToDelete) {
    try {
      const albumDocRef = doc(db, "albums", props.selectedAlbum);
      const docSnap = await getDoc(albumDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const images = data.images || [];

        const updatedImages = images.filter((_, i) => i !== indexToDelete);

        await updateDoc(albumDocRef, { images: updatedImages });

        console.log("Image deleted");
        toast.success("Image deleted!", {
          style: {
            backgroundColor: "#e85d04",
            color: "#fff",
            fontWeight: "bold",
          },
        });
      } else {
        console.warn("Album document not found");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  }

  function handleAddImageForm() {
    setShowImageForm(true);
  }
  //close button to return back to albumList component
  function handleClose() {
    setShowAlbumList(true);
  }

  return (
    <>
      {showAlbumList ? (
        <AlbumList />
      ) : (
        <>
          <div className={styles.closeButton}>
            <span className="material-symbols-outlined" onClick={handleClose}>
              close
            </span>
          </div>

          {showImageForm && (
            <ImagesForm
              url={url}
              setURL={setURL}
              title={title}
              setTitle={setTitle}
              imageFormHandleSubmit={imageFormHandleSubmit}
              imageFormHandleClear={imageFormHandleClear}
              willUpdate={willUpdate}
            />
          )}
          <div className={styles.imageListcontainer}>
            <h1>Images in {albumName}</h1>

            <Carousel
              images={imageArray}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />

            {!showImageForm && (
              <button
                onClick={handleAddImageForm}
                className={styles.imageAddButton}
              >
                Add Image
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
