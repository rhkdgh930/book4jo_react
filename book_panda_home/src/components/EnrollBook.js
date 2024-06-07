import { useState,useContext } from 'react';
import BookInfo from './BookInfo';
import styles from '../styles/EnrollBook.module.css';
import axios from 'axios';
import { CategoryListContext } from "../context/CategoryListContext";

function EnrollBook(){

    const [bookInfoList,setBookInfoList] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkc2ZAbmF2ZXIuY29tIiwiYXV0aCI6IlVTRVIiLCJleHAiOjE3MTc4MTEyMDZ9.itU3soVS6d35eQXAafD5lvpL1Qgg4bfY0VwLNtHRMpg";
    
    const salesInfo = {
        visitCount: 0,
        sellCount: 0,
        stock:0,
        categoryId:0
    }


    let inputVal = "";
    let selectedInfo = 0;
   

    const inputHandler = (event)=>{
        inputVal = event.target.value;
    }

    const search = async ()=>{
        setIsLoading(true);
       await axios.get("http://localhost:8080/book?query="+encodeURIComponent(inputVal)+"&display=10&start=1&sort=sim")
        .then((res)=>{
            setBookInfoList(res.data);
            console.log(res.data);
        })
        .catch((err)=>{
            console.log(err);
        });
        setIsLoading(false);
    }

    const selectStockHandler = function(event){
        salesInfo.stock = event.target.value;
    }
    const selectCategoryHandler  = function(e){
        salesInfo.categoryId = e.target.value;
    }

    

    return(
        <div>
             <input type="text" onChange={inputHandler}/><input type="button" value="검색" onClick={search}/>
             <div>
                {
                    isLoading === false ?
                    bookInfoList.map((bookInfo,i) =>
                        <div className={styles.container} key={i}>
                            <BookInfo  bookInfo={ bookInfo }   />
                        </div>
                    ) : <h1>로딩중....</h1>
                }
             </div>
        </div>
    )
}



export default EnrollBook;