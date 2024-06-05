import { useState,useContext } from 'react';
import BookInfo from './BookInfo';
import styles from '../styles/EnrollBook.module.css';
import axios from 'axios';
import { CategoryListContext } from "../context/CategoryListContext";

function EnrollBook(){

    const [bookInfoList,setBookInfoList] = useState([]);
    const [categoryList,setCategoryList] = useContext(CategoryListContext);
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkc2ZAbmF2ZXIuY29tIiwiYXV0aCI6IlVTRVIiLCJleHAiOjE3MTc2NDU3OTN9.dMDFPQvyKLIPw8lHRgLM1g4sIu1E8UVkhimj_UiXWQ8";
    const salesInfo = {
        visitCount: 0,
        sellCount: 0,
        stock:0
    }

    let inputVal = "";
    let selectedInfo = 0;



    const inputHandler = (event)=>{
        inputVal = event.target.value;
    }

    const search = async ()=>{

       await axios.get("http://localhost:8080/book?query="+encodeURIComponent(inputVal)+"&display=10&start=1&sort=sim")
        .then((res)=>{
            setBookInfoList(res.data);
            console.log(res.data);
        })
        .catch((err)=>{
            console.log(err);
        });

    }

    const selectInfoHandler = function(event){
        selectedInfo = event.target.value;
        bookInfoList[event.target.value].salesInfoDto=salesInfo;
        console.log(selectedInfo);
    } 

    const selectStockHandler = function(event){
        salesInfo.stock = event.target.value;
    }

    const enroll = async () => {
        axios.post("http://localhost:8080/bookSales",bookInfoList[selectedInfo],{
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

    return(
        <div>
             <input type="text" onChange={inputHandler}/><input type="button" value="검색" onClick={search}/>
             <div>
                {
                    bookInfoList.map((bookInfo,i)=>
                        <div className={styles.container} key={i}>
                            <input type='radio' name='bookInfoId' onChange={selectInfoHandler} value={i}/>
                            <BookInfo  title={bookInfo.title} img={bookInfo.image}
                                author={bookInfo.author} discount={bookInfo.discount} publisher={bookInfo.publisher} pubdate={bookInfo.pubdate} isbn={bookInfo.isbn}/>
                        </div>
                    )
                }
                <select name="categories">
                    {
                        categoryList.map((category,i)=>
                            <option value={category.id} key={i}>{category.name}</option>
                        )
                    }
                </select>
                <input type='number' min='0' onChange={selectStockHandler} placeholder='재고를 입력하세요'></input>
                <input type='button' value="등록" onClick={enroll}></input>

             </div>
        </div>
    )
}



export default EnrollBook;