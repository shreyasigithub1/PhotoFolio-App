import { onAuthStateChanged, signOut } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { provider } from "../../firebaseInit";
import { auth } from "../../firebaseInit";
import { db } from "../../firebaseInit";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
//import from react-spinning Library
import { MoonLoader } from "react-spinners";
//importing toast object
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AlbumForm from "../AlbumForm/AlbumForm";
import ImagesList from "../ImagesList/ImagesList";
import styles from "./AlbumList.module.css";

export default function AlbumList() {
  //albumName to be retrieved from AlbumForm
  const [albumName, setAlbumName] = useState("");
  //The whole albumData
  const [albumData, setAlbumData] = useState([]);

  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showImagesList, setShowImagesList] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");

  //To track Loading
  const [loading, setLoading] = useState(true);
  //To sign-in
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [wantsSignIn, setWantsSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setShowSignIn(false);
      setShowAlbumForm(false);
    });
    return () => unsubscribe();
  }, []);

  // Inside AlbumList component
  useEffect(() => {
    if (user) {
      setShowSignIn(false);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      setWantsSignIn(false); // if user logs in, hide sign-in UI
      setShowAlbumForm(false); // optionally close album form on login
    }
  }, [user]);

  function handleGoogleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user);
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }

  //Reading realtime data in useEffect from firestore database
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "albums"), (snapshot) => {
      const albumsArray = [];
      snapshot.forEach((doc) => {
        albumsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setAlbumData(albumsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  console.log(albumData); //[{id,name,images},{},{}...]

  //Function to submit AlbumForm
  async function handleSubmit(e) {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "albums"), {
      name: albumName,
      images: [],
    });
    toast.success("Album created!", {
      style: {
        backgroundColor: "#e85d04",
        color: "#fff",
        fontWeight: "bold",
      },
    });
    console.log("Document written with ID: ", docRef.id);
    setAlbumName("");
  }

  //Function to clear AlbumForm
  function handleClear() {
    setAlbumName("");
  }
  //Function to add Album
  function handleAdd() {
    if (!user) {
      setWantsSignIn(true); // user wants to sign in now
      setShowAlbumForm(false);
      return;
    }
    setWantsSignIn(false);
    setShowAlbumForm(true);
  }

  //Function to show ImagesList on clicking of the selected album
  function showImages(albumId) {
    if (!user) {
      setWantsSignIn(true);
      setShowAlbumForm(false);
      return;
    }
    setSelectedAlbum(albumId);
    setShowImagesList(true);
    setShowAlbumForm(false);
  }
  //Function to delete Album
  async function handleAlbumDelete(albumId) {
    if (!user) {
      setWantsSignIn(true);
      setShowAlbumForm(false);
      return;
    }
    try {
      const albumDocRef = doc(db, "albums", albumId);
      await deleteDoc(albumDocRef);

      toast.success("Album deleted!", {
        style: {
          backgroundColor: "#e85d04",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album.");
    }
  }
  return (
    <>
      {/* ✅ Show Sign Out button if user is logged in */}
      {user && !showImagesList && (
        <>
          <div className={styles.signedIn}>
           
            <span >
              Signed in as: {user.email}
            </span>
            <button onClick={() => signOut(auth)} style={{ margin: "1rem" }}>
              Sign Out
            </button>
          </div>
        </>
      )}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <MoonLoader size={40} color="#e85d04" />
        </div>
      ) : (
        <>
          <>
            {showImagesList ? (
              <ImagesList
                albumData={albumData}
                setAlbumData={setAlbumData}
                selectedAlbum={selectedAlbum}
              />
            ) : (
              <>
                {!user && wantsSignIn ? (
                  <div className={styles.signInFormContainer}>
                    <h2>Please sign in with Google to continue</h2>
                    <button onClick={handleGoogleSignIn}>
                      Sign in with Google
                    </button>
                  </div>
                ) : (
                  showAlbumForm && (
                    <AlbumForm
                      handleClear={handleClear}
                      handleSubmit={handleSubmit}
                      albumName={albumName}
                      setAlbumName={setAlbumName}
                    />
                  )
                )}

                <div
                  className={`${styles.albumListContainer} ${
                    showAlbumForm ? styles.formOpen : ""
                  }`}
                >
                  <h1>List of Albums</h1>
                  <ul>
                    {albumData.map((album, index) => (
                      <div key={index} className={styles.albumListElements}>
                        <li onClick={() => showImages(album.id)}>
                          {album.name}
                        </li>
                        <span
                          className="material-symbols-outlined"
                          onClick={() => handleAlbumDelete(album.id)}
                        >
                          delete
                        </span>
                      </div>
                    ))}
                  </ul>

                  {!showAlbumForm && (
                    <button
                      className={styles.addAlbumButton}
                      onClick={handleAdd}
                    >
                      Add Album
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        </>
      )}
    </>
  );
}
