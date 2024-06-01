import React from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";



function Header(){
    return(
        <div className={styles.top}>
            <div className={styles.topContainer}>
            <div className={styles.leftCategoryContainer}>
            <div> <Link to="/"> HOME</Link> </div> 
                <div>국내도서</div>
            </div>
            <div className={styles.rightCategoryContainer}>
                <div>로그인</div>
                <div>마이페이지</div>
                <div>장바구니</div>
            </div>
            </div>   
        </div>
    )
}



export default Header;