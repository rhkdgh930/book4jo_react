import Slider from '../components/Slider';
import styles from '../styles/Main.module.css';
import NewArrival from '../components/NewArrival';
import axios from 'axios';
import { useEffect,useState } from 'react';

import BookList from "../components/BookList";

function Main(){

    const [recentBookList,setRecentBookList] = useState([]);
    const [mostVisitBookList,setMostVisitBookList] = useState([]);
    const [mostSellBookList,setMostSellBookList] = useState([]);

    useEffect(()=>{

         axios.get("/api/bookSales/order/id")
        .then((res)=>{
            console.log(res.data);
            setRecentBookList(res.data);
        })
        .catch((err)=>{

        });
        
        axios.get("/api/bookSales/order/visitCount")
        .then((res)=>{
            setMostVisitBookList(res.data);
        })
        .catch((err)=>{

        });


        axios.get("/api/bookSales/order/sellCount")
        .then((res)=>{
            setMostSellBookList(res.data);
        })
        .catch((err)=>{

        });



    },[]);

    return(
        <div className={styles.container}>
            <Slider></Slider>
            
            <BookList listTitle="최신 도서"  bookList={recentBookList} />
            <BookList listTitle="가장 많이 팔린 도서" bookList={mostSellBookList}/>
            <BookList listTitle="가장 조회수가 많은 도서" bookList={mostVisitBookList}/>
            
        </div>
    )
}



export default Main;