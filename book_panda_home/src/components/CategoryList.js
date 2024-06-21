import { useState, useEffect, useRef, useContext } from "react";
import api from "../api";
import styles from "../styles/CategoryList.module.css";
import { CategoryListContext } from "../context/CategoryListContext";

function CategoryList() {
  const [categoryList, setCategoryList] = useContext(CategoryListContext);
  const inputRef = useRef(null);

  let selected = "";
  let inputVal = "";

  const showCategories = () => {
    api
      .get("/category")
      .then((res) => {
        setCategoryList(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  const addCategory = async () => {
    await api
      .post(
        "/category",
        {
          name: inputVal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        showCategories();
      })
      .catch((err) => {});
    inputRef.current.value = null;
    inputVal = "";
  };

  const deleteCategory = async () => {
    await api
      .delete("/category/" + selected, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        showCategories();
      })
      .catch((err) => {});
  };

  const updateCategory = async () => {
    await api
      .put(
        "/category/" + selected,
        {
          name: inputVal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        showCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const inputChangeHandler = (event) => {
    inputVal = event.target.value;
  };

  const radioChangeHandler = (event) => {
    selected = event.target.value;
  };

  return (
    <div>
      <div className={styles.container}>
      {categoryList.map((category, i) => (
        <li key={i} className={styles.categoryList}>
          <input type="radio" value={category.id} name="categoryId" onChange={radioChangeHandler} />
          {category.name}
        </li>
      ))}
      </div>
      <input type="text" onChange={inputChangeHandler} ref={inputRef} />
      <p>
        <input type="button" value="수정" onClick={updateCategory} />
        <input type="button" value="삭제" onClick={deleteCategory} />
        <input type="button" value="추가" onClick={addCategory} />
      </p>
    </div>
  );
}

export default CategoryList;
