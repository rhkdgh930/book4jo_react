import React, {useState} from "react"
import CartItem from "./CartItem";
import styles from '../styles/Cart.module.css';

function Cart() {
    const [items, setItems] = useState(
        [
        //테스트 데이터
        {
          id: 1,
          title: "테스트 책 1",
          image: "https://via.placeholder.com/50",
          quantity: 1,
          price: 50000,
          checked: true
        },
        {
          id: 2,
          title: "테스트 책 2",
          image: "https://via.placeholder.com/50",
          quantity: 2,
          price: 30000,
          checked: true
        }
      ]
    )

    const [allChecked, setAllChecked] = useState(true)

    const handleQuantityChange = (id, quantity) => {
        setItems(items.map(item => item.id === id? {...item, quantity: Number(quantity)} : item
        ))
    }

    const handleCheckChange = (id) => {
        setItems(items.map(item => 
            item.id === id ? {...item, checked: !item.checked } : item
        ))
    }

    const handleSelectAllToggle = () => {
        const newAllChecked = !allChecked;
        setAllChecked(newAllChecked)
        setItems(items.map((item) => ({...item, checked: newAllChecked})))
    }

    const handleRemoveItem = (id) => {
        if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
            setItems(items.filter((item) => item.id !== id))
        }
    }

    const handleRemoveSelected = () => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            setItems(items.filter(item => !item.checked))
        }
    }


    return (
        <div className={styles.cartContainer}>
            {items.length === 0 ? (
                <div>
                    <p>장바구니가 비어있습니다</p>
                    <button>쇼핑하러 가기</button>
                </div>
            ) : (
                <>
                    <button onClick={handleRemoveSelected} className={styles.deleteButton}>삭제</button>
                    <table className={styles.cartTable}>
                        <thead>
                            <tr>
                                <th><input 
                                        type = "checkbox"
                                        checked = {allChecked}
                                        onChange = {handleSelectAllToggle}
                                /></th>
                                <th>상품명</th>
                                <th>주문 수량</th>
                                <th>가격</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onCheckChange={handleCheckChange}
                                    onRemove={()=>handleRemoveItem(item.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.cartSummary}>
                        총 {items.length}종, {items.reduce((total, item) => total + item.quantity, 0)}권의 가격은 {items.reduce((total, item) => total + item.price * item.quantity, 0)}원입니다.
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.orderButton}>선택 상품 주문하기</button>
                        <button className={styles.continueButton}>더 담으러 가기</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart