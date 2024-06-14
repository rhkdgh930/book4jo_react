import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import styles from "../styles/Cart.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [items, setItems] = useState([]);
    const [allChecked, setAllChecked] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [cartId, setCartId] = useState('');

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No access token found");
            }

            const response = await axios.get("/api/cart/items", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            const cartItems = Array.isArray(response.data)
                ? response.data.map((item) => ({
                    ...item,
                    checked: true,
                }))
                : [];
            setItems(cartItems);
        } catch (error) {
            console.error("Error fetching cart items", error);
        }
    };

    const updateCartItemQuantity = async (id, quantity) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No access token found");
            }

            await axios.patch(`/api/cart/items/${id}/quantity`, null, {
                params: { quantity },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error updating cart item quantity", error);
        }
    };

    const handleQuantityChange = (id, quantity) => {
        const item = items.find((item) => item.id === id);
        if (quantity > item.stock) {
            alert(`최대 주문 가능 수량은 ${item.stock}권입니다.`);
            return;
        }
        if (quantity < 1) return;
        setItems(items.map((item) => (item.id === id ? { ...item, quantity: Number(quantity) } : item)));
        updateCartItemQuantity(id, quantity);
    };

    const handleCheckChange = (id) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setItems(updatedItems);
        setAllChecked(updatedItems.every(item => item.checked));
    };

    const handleSelectAllToggle = () => {
        const newAllChecked = !allChecked;
        setAllChecked(newAllChecked);
        setItems(items.map((item) => ({ ...item, checked: newAllChecked })));
    };

    const handleRemoveItem = async (id) => {
        if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("No access token found");
                }

                await axios.delete(`/api/cart/items/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setItems(items.filter((item) => item.id !== id));
            } catch (error) {
                console.error("Error deleting cart item", error);
            }
        }
    };

    const handleRemoveSelected = async () => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            const selectedItems = items.filter((item) => item.checked);
            for (const item of selectedItems) {
                await handleRemoveItem(item.id);
            }
        }
    };

    const handleOrder = async () => {
        setIsLoading(true);
        try {
            // const token = localStorage.getItem("accessToken");
            // if (!token) {
            //     throw new Error("No access token found");
            // }

            // const selectedItems = items.filter((item) => item.checked).map((item) => ({
            //     id: item.id,
            //     quantity: item.quantity,
            // }));

            // if (selectedItems.length === 0) {
            //     alert("선택한 상품이 없습니다.");
            //     setIsLoading(false);
            //     return;
            // }

            // const requestData = {
            //     orderDate: new Date(),
            //     items: selectedItems,
            // };

            navigate(`/cart/order`);
        } catch (error) {
            console.error("주문 오류: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const checkedItemsCount = items.filter((item) => item.checked).length;
    const totalQuantity = items.reduce((total, item) => (item.checked ? total + item.quantity : total), 0);
    const totalPrice = items.reduce((total, item) => (item.checked ? total + item.price * item.quantity : total), 0);

    return (
        <div className={styles.cartContainer}>
            {items.length === 0 ? (
                <div className={styles.emptyCart}>
                    <p>장바구니가 비어있습니다</p>
                    <button onClick={handleGoBack}>쇼핑하러 가기</button>feature/order
                </div>
            ) : (
                <>
                    <button onClick={handleRemoveSelected} className={styles.deleteButton}>
                        삭제
                    </button>
                    <table className={styles.cartTable}>
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" checked={allChecked} onChange={handleSelectAllToggle} />
                                </th>
                                <th>상품명</th>
                                <th>주문 수량</th>
                                <th>가격</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onCheckChange={handleCheckChange}
                                    onRemove={() => handleRemoveItem(item.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.cartSummary}>
                        총 {checkedItemsCount}종, {totalQuantity}권의 가격은 {totalPrice.toLocaleString()}원입니다.
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.orderButton} onClick={handleOrder} disabled={isLoading}>
                            {isLoading ? "추가 중..." : "선택 상품 주문하기"}
                        </button>
                        <button className={styles.continueButton} onClick={handleGoBack}>
                            더 담으러 가기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
