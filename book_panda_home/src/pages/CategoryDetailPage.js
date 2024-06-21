import styles from "../styles/CategoryDetailPage.module.css";
import { useEffect, useState } from "react";
import api from "../api";
import { useSearchParams, Link } from "react-router-dom";
import Pagination from "react-js-pagination";

function CategoryDetailPage() {
  const [categoryName, setCategoryName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookSalesList, setBookSalesList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pages: 0,
    books: [],
  });
  const [order, setOrder] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/category/" + searchParams.get("id"))
      .then((res) => {
        setCategoryName(res.data.name);
      })
      .catch(() => {});

    api
      .get(
        "/bookSales?categoryId=" + searchParams.get("id") + "&page=" + (page - 1) + "&size=10" + "&order=" + order
      )
      .then((res) => {
        setBookSalesList(res.data);
        setPageInfo(res.data);
        console.log(res.data);
      });
  }, [searchParams, page, order]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleOrderStat = (e) => {
    console.log(e.target.value);
    setOrder(e.target.value);
    setPage(1);
  };

  const truncateTitle = (title) => {
    return title.length > 22 ? title.substring(0, 22) + "..." : title;
  };

  const truncateAuthorPublisher = (author, publisher) => {
    const combined = `${author} | ${publisher}`;
    return combined.length > 10 ? combined.substring(0, 12) + "..." : combined;
  };

  return (
    <div className={styles.container}>
      <h1>{categoryName}</h1>

      <select name="order" onChange={handleOrderStat} className={styles.selectOrder}>
        <option value="">등록순</option>
        <option value="sellCount">판매량순</option>
        <option value="visitCount">조회순</option>
      </select>
      <div className={styles.books}>
        {pageInfo.books.map((bookSales, i) => (
          <Link key={i} to={`/bookSalesDetail?id=${bookSales.id}`} style={{ color: "black" }}>
            <div className={styles.bookContainer}>
              <div className={styles.imageArea}>
                <img src={bookSales.bookInfo.image} className={styles.image}></img>
              </div>
              <div className={styles.explain}>
                <div>
                  <strong>{truncateTitle(bookSales.bookInfo.title)}</strong>
                </div>
                <div className={styles.author}>
                  {truncateAuthorPublisher(bookSales.bookInfo.author, bookSales.bookInfo.publisher)}
                </div>
                <div className={styles.priceTag}>{bookSales.bookInfo.discount}원</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination className={styles.paging}
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

export default CategoryDetailPage;
