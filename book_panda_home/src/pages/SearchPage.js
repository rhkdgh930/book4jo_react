import { useEffect, useState } from "react";
import api from "../api";
import Pagination from "react-js-pagination";
import { useSearchParams, Link } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState({
    pages: 0,
    books: [],
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/bookSales/search?keyword=" + searchParams.get("keyword") + "&page=" + (page - 1) + "&size=10")
      .then((res) => {
        setPageInfo(res.data);
      });
  }, [searchParams, page]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className={styles.container}>
      <div className={styles.bookList}>
        {pageInfo.books.map((bookSales, i) => (
          <Link key={i} to={`/bookSalesDetail?id=${bookSales.id}`} style={{ color: "black" }}>
            <div className={styles.bookContainer}>
              <div className={styles.imageContainer}>
                <img src={bookSales.bookInfo.image} alt={bookSales.bookInfo.title} className={styles.bookImage} />
              </div>
              <div className={styles.infoContainer}>
                <h6 className={styles.bookTitle}>
                  {bookSales.bookInfo.title} {bookSales.bookInfo.subtitle}
                </h6>
                <div className={styles.bookAuthor}>저자 : {bookSales.bookInfo.author}</div>
                <div className={styles.bookPrice}>가격 : {bookSales.bookInfo.discount}원</div>
                <p className={styles.bookDescription}>{bookSales.bookInfo.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={pageInfo.pages * 10}
        pageRangeDisplayed={5}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default SearchPage;
