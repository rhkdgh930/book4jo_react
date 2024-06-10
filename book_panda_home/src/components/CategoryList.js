import { useState,useEffect,useRef, useContext } from "react";
import axios from 'axios';
import styles from '../styles/CategoryList.module.css';
import { CategoryListContext } from "../context/CategoryListContext";



function CategoryList(){

    const [categoryList,setCategoryList] = useContext(CategoryListContext);
    const inputRef = useRef(null);
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkc2ZAbmF2ZXIuY29tIiwiYXV0aCI6IlVTRVIiLCJleHAiOjE3MTc4MTEyMDZ9.itU3soVS6d35eQXAafD5lvpL1Qgg4bfY0VwLNtHRMpg";

    let selected = "";
    let inputVal = "";

    const showCategories = () => {
        axios.get("http://localhost:8080/api/category")
            .then((res)=>{
                setCategoryList(res.data);
            })
            .catch((err)=>{
                console.log('err:',err);
            });
    }

     const addCategory = async () => {
        await axios.post("http://localhost:8080/api/category", {
            name:inputVal
        },{
            headers: {
                Authorization:`Bearer ${token}`,
            }
        })
        .then((res) => {
           showCategories();
        })
        .catch((err)=> {

        })
        inputRef.current.value = null;
        inputVal ="";
    }

    const deleteCategory = async () => {
        await axios.delete("http://localhost:8080/api/category/"+selected ,{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        })
        .then((res)=>{
            showCategories();
        })
        .catch((err)=>{

        });
    }


    const updateCategory = async () => {
        await axios.put("http://localhost:8080/api/category/"+selected , {
            name:inputVal
        }, {
            headers:{
                Authorization:`Bearer ${token}`,
            }
        })
        .then(()=>{
            showCategories();
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    
    const inputChangeHandler = (event) =>{
        inputVal = event.target.value;
    }

    const radioChangeHandler = (event) =>{
        selected = event.target.value;
    }

  
    return(
        <div>
            
            {categoryList.map((category,i) => <li key={i} className={styles.categoryList}> 
                <input type="radio" value={category.id} name="categoryId" onChange={radioChangeHandler}/>  
                        {category.name}
                </li>
            )}
            <input type="text" onChange={inputChangeHandler} ref={inputRef}/>
            <p>
                <input type="button" value="수정" onClick={updateCategory}/>
                <input type="button" value="삭제" onClick={deleteCategory}/>
                <input type="button" value="추가" onClick={addCategory}/>
            </p>
        
        </div>
    )
}


export default CategoryList;