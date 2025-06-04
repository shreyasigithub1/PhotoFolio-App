import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <>
      <div className={styles.navbar}>
        <img src="https://cdn-icons-png.flaticon.com/128/9732/9732025.png" />
        <p>PhotoFolio</p>
      </div>
    </>
  );
}
