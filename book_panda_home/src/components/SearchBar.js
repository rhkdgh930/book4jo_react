import React from 'react';
import styles from '../styles/SearchBar.module.css';

function SearchBar(){
    return(
        <div className={styles.container}>
            <h1>책판다</h1>
            <div className={styles.searchBar}>
                <select>
                    <option>통합검색</option>
                    <option>국내도서</option>
                    <option>외국도서</option>    
                </select>      
                <input type='text'></input>  
                <button type='submit'>검색</button>
            </div>    
        </div>
    )
}


export default SearchBar;
