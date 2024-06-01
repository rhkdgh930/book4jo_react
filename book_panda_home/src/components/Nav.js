import styles from '../styles/Nav.module.css';
import { useState } from 'react';


function Nav(){

    const [toggle,setToggle] = useState(false);

    const toggleMenu = (bool) => {
        setToggle(bool);
    }

    return (
        <div className={styles.container}>
           
                <div className={styles.categoryButton} onMouseOver={()=>toggleMenu( true )} onMouseOut={()=>toggleMenu(false)} >카테고리</div>
                <div className={ toggle?  `${styles.categoryVisible}` : `${styles.categoryHidden}`}  onMouseOver={()=>toggleMenu( true )}
                    onMouseOut={()=> toggleMenu(false)}>

                </div>
            
            <hr className={styles.hr}></hr>
        </div>
    )
}


export default Nav;