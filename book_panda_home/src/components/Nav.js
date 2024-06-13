import styles from "../styles/Nav.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CategoryListContext } from "../context/CategoryListContext";
import { Link } from "react-router-dom";

function Nav() {
  const [toggle, setToggle] = useState(false);
  const [categoryList, setCategoryList] = useContext(CategoryListContext);

  const toggleMenu = (bool) => {
    setToggle(bool);
  };

  const showCategories = () => {
    axios
      .get("/api/api/category")
      .then((res) => {
        console.log(res.data);
        setCategoryList(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  useEffect(() => {
    showCategories();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.categoryButton} onMouseOver={() => toggleMenu(true)} onMouseOut={() => toggleMenu(false)}>
        카테고리
      </div>
      <div
        className={toggle ? `${styles.categoryVisible}` : `${styles.categoryHidden}`}
        onMouseOver={() => toggleMenu(true)}
        onMouseOut={() => toggleMenu(false)}
      >
        <div className={styles.categoryTitle}>국내도서</div>
        <div className={styles.categoryContainer}>
          {categoryList.map((category, i) => (
            <Link to={`/category?id=${category.id}`} className={styles.link} key={i}>
              {" "}
              <li className={styles.categoryList}>{category.name}</li>
            </Link>
          ))}
        </div>
      </div>
      <hr className={styles.hr}></hr>
    </div>
  );
}

export default Nav;
