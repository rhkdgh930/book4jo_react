





function Category(){
    return(
        <div>
            <input list="categoryList"></input>
            <datalist id="categoryList">
                <option value="소설"></option>
                <option value="경영"></option>
                <option value="기술"></option>
            </datalist>
        </div>
    )
}


export default Category;