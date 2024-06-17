




function BookItem(props){
    return(
        <div>
            <div >
                <img style={{width:"100px" , height:"100px"}}  src={props.book.bookInfo.image} alt=""></img>
            </div>
            <h6>{props.book.bookInfo.title}</h6>
        </div>
    )
}



export default BookItem;