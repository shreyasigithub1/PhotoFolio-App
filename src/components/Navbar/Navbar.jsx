import styles from "./Navbar.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseInit";

export default function Navbar({ user }) {
  return (
    <>
      <div className={styles.navbar}>
        <img src="https://cdn-icons-png.flaticon.com/128/9732/9732025.png" />
        <p>PhotoFolio</p>

        {/* {user ? (
          <>
            <div className={styles.signInContainer}>
              <span>Signed in as: {user.email}</span>
              <button
                onClick={() => signOut(auth)}
                style={{ marginRight: "1rem" }}
              >
                Sign Out
              </button>
            </div>
          </>
        ) : null} */}
      </div>
    </>
  );
}
