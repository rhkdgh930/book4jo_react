import { useState,useEffect,useRef, useContext } from "react";
import axios from 'axios';
import styles from '../styles/CategoryList.module.css';
import { CategoryListContext } from "../context/CategoryListContext";



function CategoryList(){

    const [categoryList,setCategoryList] = useContext(CategoryListContext);
    const inputRef = useRef(null);


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
                Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYXV0aCI6ImFkbWluIn0.OYlDdUOQUy29VnT1bUM_gomjMsblliBrMIS35QXHKUs`,
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
                Authorization:`Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaGZqc2RrQHNkZmdzZGguY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTcxNzQ3NzE0NX0.594B0xlUe75QWvP2ULZ-K0KIVyjDj6F3gW1poHAWLnk`
            }
        })
        .then((res)=>{
            showCategories();
        })
        .catch((err)=>{

        });
    }
    
    const inputChangeHandler = (event) =>{
        inputVal = event.target.value;
    }

    const radioChangeHandler = (event) =>{
        selected = event.target.value;
    }

    useEffect(() => {
        showCategories();
    }, [])

    return(
        <div>
            
            {categoryList.map((category,i) => <li key={i} className={styles.categoryList}> 
                <input type="radio" value={category.id} name="categoryId" onChange={radioChangeHandler}/>  
                        {category.name}
                </li>
            )}
            <input type="text" onChange={inputChangeHandler} ref={inputRef}/>
            <p>
                <input type="button" value="수정"/>
                <input type="button" value="삭제" onClick={deleteCategory}/>
                <input type="button" value="추가" onClick={addCategory}/>
            </p>
        
        </div>
    )
}


export default CategoryList;