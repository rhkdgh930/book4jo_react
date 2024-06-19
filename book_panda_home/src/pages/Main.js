import Slider from '../components/Slider';
import styles from '../styles/Main.module.css';
import NewArrival from '../components/NewArrival';
import api from '../api';
import { useEffect,useState } from 'react';

import BookList from "../components/BookList";

function Main(){

    const [recentBookList,setRecentBookList] = useState([]);
    const [mostVisitBookList,setMostVisitBookList] = useState([]);
    const [mostSellBookList,setMostSellBookList] = useState([]);

    useEffect(()=>{

         api.get("/bookSales/order/id")
        .then((res)=>{
            console.log(res.data);
            setRecentBookList(res.data);
        })
        .catch((err)=>{

        });
        
        api.get("/bookSales/order/visitCount")
        .then((res)=>{
            setMostVisitBookList(res.data);
        })
        .catch((err)=>{

        });


        api.get("/bookSales/order/sellCount")
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