import { Link } from "react-router-dom";
import styles from "../styles/BookInfo.module.css";

function BookInfo(props) {
  const handleDiscount = function (e) {
    props.bookInfo.discount = e.target.value;
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={props.bookInfo.image} className={styles.image} alt="Book Cover" />
        <Link to="/admin/bookDetail" state={{ bookInfo: props.bookInfo }}>
          <button className={styles.registerButton}>등록</button>
        </Link>
      </div>

      <div className={styles.infoContainer}>
        <h3 className={styles.infoContainer}>{props.bookInfo.title}</h3>
        <div>저자: {props.bookInfo.author}</div>
        <div className={styles.bookDescription}>{props.bookInfo.description}</div>
      </div>
    </div>
  );
}

export default BookInfo;
