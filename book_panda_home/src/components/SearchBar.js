import React, { useEffect, useState } from 'react';
import { Link,useNavigate  } from "react-router-dom";
import styles from '../styles/SearchBar.module.css';
import api from '../api';
import panda from "../assets/images/panda1.png"

function SearchBar(props) {

    const [autocompleteItem, setAutocompleteItem] = useState([]);
    const [keyword, setKeyword] = useState("");
    // const [toggle, setToggle] = useState(false);

    const keywordHandler = (e) => {
        setKeyword(e.target.value);
        props.setToggle(true);
        // setToggle(true);
    }
    
    const clickClose = (e) => {
        props.setToggle(false);
        // setToggle(false);
    }

    const navigate = useNavigate();

    const search = ()=>{
       
        navigate('/search?keyword='+keyword);
    }


    useEffect(() => {
        if (keyword) {
            api.get("/bookSales/title?keyword=" + keyword)
                .then((res) => {
                    setAutocompleteItem(res.data);
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [keyword])

    return (
        <div className={styles.container}>
            <div className={styles.logoimage}><Link to="/" id="logoLink"><img src={panda} alt="Panda Logo" /></Link></div>
            <div className={styles.logo}><Link to="/" id="logoLink">책판다</Link></div>
            <div className={styles.searchBar}>
                <select>
                    <option>도서검색</option>
                    {/* <option>국내도서</option>
                    <option>외국도서</option> */}
                </select>
                <input type='text' onChange={keywordHandler}></input>
                <button type='submit' onClick={search}>검색</button>
            </div>
            <div className={props.toggleValue ? `${styles.autocompleteVisible}` : `${styles.autocompleteHidden}`} style={{float:'inherit'}}>
                <div className={styles.itemContainer}>
                    {
                        autocompleteItem.map((bookTitle, i) =>
                            <div key={i} className={styles.autocompleteItem}>
                                <Link to={`/bookSalesDetail?id=${bookTitle.id}`} style={{textDecoration:'none' , color:'black'}}>
                                {bookTitle.title}
                                </Link>
                            </div>
                        )
                    }
                    <button onClick={clickClose}>닫기</button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;
