
import styles from '../styles/BookInfo.module.css';


function BookInfo(props){

    return(
        <div className={styles.container}>
            <img  src={props.img} className={styles.image}/>
            <div>
                <h6>{props.title}</h6>
                <div>가격: {props.discount}</div>
                <div>저자: {props.author}</div>
                <div>isbn: {props.isbn}</div>
                <div>발행일: {props.pubdate}</div>
            </div>
        </div>
    )
}


export default BookInfo;