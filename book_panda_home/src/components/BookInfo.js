
import { Link } from 'react-router-dom';
import styles from '../styles/BookInfo.module.css';


function BookInfo(props){

    const handleDiscount = function(e){
        props.bookInfo.discount = e.target.value;
    }

    return(
        <div className={styles.container}>
            <img  src={props.bookInfo.image} className={styles.image}/>
            <div>
                <div>
                    <h6>{props.bookInfo.title}</h6>
                   <Link to="../bookDetail" state={{ bookInfo : props.bookInfo}}><input type='button' value="등록"/></Link> 
                </div>
                <div>저자: {props.bookInfo.author}</div>
                <div>
                    {props.bookInfo.description}
                </div>
            </div>
        </div>
    )
}


export default BookInfo;