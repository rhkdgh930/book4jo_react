import React, {useState, useEffect} from "react"
import CartItem from "./CartItem"
import styles from "../styles/Cart.module.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [items, setItems] = useState([])
    const [allChecked, setAllChecked] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCartItems();

        const handleBeforeUnload = async (event) => {
            await saveCartState();
        }
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            saveCartState();
        }
    }, [])

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('/api/cart/items')
            const cartItems = response.data.map(item => ({
                ...item,
                checked: true
            }))
            setItems(cartItems)
        } catch (error) {
            console.error('Error fetching cart items', error)
        }
    }

    const saveCartState = async () => {
        try {
            await axios.post('/api/cart/save', {items})
        } catch (error) {
            console.error('Error saving cart state', error)
        }
    }

    const handleQuantityChange = (id, quantity) => {
        setItems(items.map(item => item.id === id? {...item, quantity: Number(quantity)} : item
        ))
    }

    const handleCheckChange = (id) => {
        setItems(items.map(item => item.id === id ? {...item, checked: !item.checked } : item
        ))
    }

    const handleSelectAllToggle = () => {
        const newAllChecked = !allChecked;
        setAllChecked(newAllChecked)
        setItems(items.map((item) => ({...item, checked: newAllChecked})))
    }

    const handleRemoveItem = (id) => {
        if (window.confirm('해당 상품을 삭제하시겠습니까?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleRemoveSelected = () => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            setItems(items.filter(item => !item.checked))
        }
    }

    const handleOrder = async () => {
        try {
            await saveCartState()
            navigate('/order') // 주문 페이지로 이동
        } catch (error) {
            console.error('Error placing order', error)
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const checkedItemsCount = items.filter(item => item.checked).length
    const totalQuantity = items.reduce((total, item) => item.checked ? total + item.quantity : total, 0)
    const totalPrice = items.reduce((total, item) => item.checked ? total + item.price * item.quantity : total, 0)
    

    return (
        <div className={styles.cartContainer}>
            {items.length === 0 ? (
                <div className={styles.emptyCart}>
                    <p>장바구니가 비어있습니다</p>
                    <button onClick={handleGoBack}>쇼핑하러 가기</button>
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
                        총 {checkedItemsCount}종, {totalQuantity}권의 가격은 {totalPrice.toLocaleString()}원입니다.
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.orderButton} onClick={handleOrder}>선택 상품 주문하기</button>
                        <button className={styles.continueButton} onClick={handleGoBack}>더 담으러 가기</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart