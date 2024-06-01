import { Link , Outlet } from "react-router-dom";
import styles from '../styles/AdminPage.module.css';

function AdminPage(){

    return(
        <div className={styles.container}>
            <Link to="category"> <button>카테고리 관리</button> </Link>  
            <Link to="user"> <button>유저 관리</button> </Link>  
            <Outlet/>
        </div>
    )
}


export default AdminPage;