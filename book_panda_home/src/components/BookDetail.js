import { useLocation } from "react-router-dom";
import { useState,useContext } from 'react';
import styles from '../styles/BookDetail.module.css';
import { CategoryListContext } from "../context/CategoryListContext";
import axios from "axios";

function BookDetail(props){
    const location = useLocation();
    const [categoryList,setCategoryList] = useContext(CategoryListContext);
    const [bookInfo,setBookInfo] = useState(location.state.bookInfo);
    const initialDiscount = bookInfo.discount;
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkc2ZAbmF2ZXIuY29tIiwiYXV0aCI6IlVTRVIiLCJleHAiOjE3MTc4MTEyMDZ9.itU3soVS6d35eQXAafD5lvpL1Qgg4bfY0VwLNtHRMpg";
    const salesInfo = {
        visitCount: 0,
        sellCount: 0,
        stock:0,
        categoryId:0
    }

    const enroll = async () => {
        axios.post("http://localhost:8080/bookSales",{
            ...bookInfo,salesInfoDto:salesInfo
        },{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        })
        .then((res)=>{
            alert('등록완료!');
        })
        .catch((err)=>{
            alert('오류 발생!');
        });
    }


    const handleDiscountChange = ({target}) =>{
        setBookInfo((prev) => ({...prev, discount : target.value}));
    }

    const print = ()=>{
        console.log(bookInfo);
        console.log(salesInfo);
    }

    const initialize = ()=>{
        setBookInfo((prev) => ({...prev, discount : initialDiscount}));
    }

    const handleCategoryChange = (e) => {
        salesInfo.categoryId = e.target.value;
    }
    const handleStockChange = (e) => {
        salesInfo.stock = e.target.value;
    }

    return(
        <div className={styles.container}>
            <img src={bookInfo.image}></img>
            <div>
                <h1>{bookInfo.title}</h1>
                <div>
                    저자 : {bookInfo.author}
                </div>
                <div>
                    출판사 : {bookInfo.publisher}
                </div>
                <div>
                    {bookInfo.description}
                </div>
                가격 : <input type="text"  defaultValue={bookInfo.discount} onChange = {handleDiscountChange}/>
                <input type="button" value="가격 초기화" onClick={initialize}/>
                <div>
                    카테고리 : 
                    <select onChange={handleCategoryChange}>
                        {
                            categoryList.map((category,i)=>
                                <option value={category.id} key={i}>{category.name}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    재고 : <input type="number" min={0} onChange={handleStockChange}/>
                </div>
                <div>
                    <input type="button" value="등록하기" onClick={enroll}/>
                </div>
            </div>
        </div>
    )
}


export default BookDetail;