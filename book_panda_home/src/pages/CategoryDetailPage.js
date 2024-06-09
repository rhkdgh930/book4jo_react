
import styles from '../styles/CategoryDetailPage.module.css'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';

function CategoryDetailPage(){

    const [categoryName,setCategoryName] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [bookSalesList, setBookSalesList] = useState([]);
    const [page,setPage] = useState(1);

    useEffect(()=>{

        axios.get('http://localhost:8080/api/category/'+searchParams.get('id'))
        .then((res)=>{
            setCategoryName(res.data.name);
        })
        .catch(()=>{

        });


        axios.get('http://localhost:8080/bookSales?categoryId='+searchParams.get('id')+'&page='+(page-1)+'&size=10')
        .then((res)=>{
            setBookSalesList(res.data);
            
        })



    },[searchParams,page]);

    const handlePageChange = (page) =>{
        setPage(page);
        
    };

    return(
        <div className={styles.container}>
            <h1>{categoryName}</h1>
            <div className={styles.books}>
            {
                bookSalesList.map((bookSales,i)=>
                    <div key={i} className={styles.bookContainer}>
                        <div className={styles.imageArea}>
                            <img src={bookSales.bookInfo.image} className={styles.image}></img>
                        </div>
                        <div className={styles.explain}>
                            <div><strong>{bookSales.bookInfo.title}</strong></div>
                            <div>{bookSales.bookInfo.author} 지음 | {bookSales.bookInfo.publisher}</div>
                            <div className={styles.priceTag}>{bookSales.bookInfo.discount}원</div>
                        </div>
                        
                    </div>
                )
            }
            </div>

            <Pagination  
                className={styles.pagination}
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={300}
                pageRangeDisplayed={5}
                prevPageText={"<"}
                nextPageText={">"}
                onChange={handlePageChange}
            />
            
        </div>
    )
}


export default CategoryDetailPage;