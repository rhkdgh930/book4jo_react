import { useEffect,useState} from "react";
import api from "../api";
import Pagination from "react-js-pagination";
import { useSearchParams, Link } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";


function SearchPage(){

    const [categoryName, setCategoryName] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageInfo, setPageInfo] = useState({
        pages: 0,
        books: [],
    });
    const [page, setPage] = useState(1);

    useEffect(() => {
        api
          .get(
            "/bookSales/search?keyword=" + searchParams.get("keyword") + "&page=" + (page - 1) + "&size=10")
          .then((res) => {
            setPageInfo(res.data);
          });
      }, [searchParams, page]);

      const handlePageChange = (page) => {
        setPage(page);
      };


    return(
    <div style={{width: '1030px' , margin:'auto'}}>

{       pageInfo.books.map((bookSales, i) => (
          <Link key={i} to={`/bookSalesDetail?id=${bookSales.id}`} style={{ color: "black" }}>
                <div className={styles.container}>
                    <div>
                        <img src={bookSales.bookInfo.image}></img>
                    </div>
                    <div>
                        <h6>{bookSales.bookInfo.title}</h6>
                        <div>저자: {bookSales.bookInfo.title}</div>
                        <div>가격: {bookSales.bookInfo.discount}</div>
                        <p>
                            {bookSales.bookInfo.description}
                        </p>
                    </div>
                </div>
          </Link>
        ))}
        
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