import { Link , Outlet } from "react-router-dom";
import styles from '../styles/AdminPage.module.css';

function AdminPage(){

    return(
        <div className={styles.container}>
            <div className={styles.navbar}>
                <Link to="category"> <button>카테고리 관리</button> </Link>  
                <Link to="enrollBook"><button>책 등록</button></Link>
                <Link to="shippingManagement"> <button>주문 배송 관리</button> </Link>  
            </div>
            <div className={styles.content}>
                <Outlet/>   
            </div>
        
        </div>
    )
}


export default AdminPage;