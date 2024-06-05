import styles from '../styles/Nav.module.css';
import { useState,useEffect, useContext } from 'react';
import axios  from 'axios';
import { CategoryListContext } from '../context/CategoryListContext';

function Nav(){

    const [toggle,setToggle] = useState(false);
    const [categoryList,setCategoryList] = useContext(CategoryListContext);

    const toggleMenu = (bool) => {
        setToggle(bool);
    }

    const showCategories = () => {
        axios.get("http://localhost:8080/api/category")
            .then((res)=>{
                console.log(res.data);
                setCategoryList(res.data);
            })
            .catch((err)=>{
                console.log('err:',err);
            });
    }


    useEffect(() => {
        showCategories();
    }, [])

    return (
        <div className={styles.container}>
           
                <div className={styles.categoryButton} onMouseOver={()=>toggleMenu( true )} onMouseOut={()=>toggleMenu(false)} >카테고리</div>
                <div className={ toggle?  `${styles.categoryVisible}` : `${styles.categoryHidden}`}  onMouseOver={()=>toggleMenu( true )}
                    onMouseOut={()=> toggleMenu(false)}>
                    {
                        categoryList.map((category,i) => 
                            <li key={i} className={styles.categoryList}>{category.name}</li>
                        )
                    }
                </div>
            
            <hr className={styles.hr}></hr>
        </div>
    )
}


export default Nav;