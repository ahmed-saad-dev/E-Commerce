import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function UserMenu({ isLoggedIn }) {
  return (
    <Link to={isLoggedIn ? "/userProf" : "/login"} className={styles.navBtn}>
      <span className={styles.navBtnTop}>
        {isLoggedIn ? "حسابك" : "أهلاً، سجل دخولك"}
      </span>
      <span className={styles.navBtnBot}>
        <FaUser className={styles.navBtnIcon} /> حسابي
      </span>
    </Link>
  );
}
