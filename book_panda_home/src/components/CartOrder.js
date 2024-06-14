import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Post from './Post';
import styles from '../styles/order.module.css';
import style from '../styles/CartItem.module.css';

function CartOrder() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(''); // 주소 상태 추가
    const [showPost, setShowPost] = useState(false); // 팝업 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartOrder();
    }, []);

    const fetchCartOrder = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await axios.get('/api/cart/order', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setCart(response.data);
        } catch (error) {
            console.error('주문 정보 요청 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No access token found");
            }

            // const selectedItems = items.filter((item) => item.checked).map((item) => ({
            //     id: item.id,
            //     quantity: item.quantity,
            // }));

            // if (selectedItems.length === 0) {
            //     alert("선택한 상품이 없습니다.");
            //     setIsLoading(false);
            //     return;
            // }

            const getKoreanDate = () => {
                const date = new Date();
                const offset = 9 * 60; // 한국 시간은 UTC+9
                const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
                return koreanDate;
            };

            const requestData = {
                orderDate: getKoreanDate(),
            };

            // 주문 추가
            const response = await axios.post("/api/orders", requestData, {
                // params: { id: queryParams.id },
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                withCredentials: true,
            });

        } catch (error) {
            console.error("주문 오류: ", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.orderInfo}>
            <h2 className={styles.heading}>주문 정보</h2>
            <h3 className={styles.subheading}>주문 상품</h3>
            <table className={styles.orderTable}>
                <thead>
                    <tr>
                        <th>상품</th>
                        <th>수량</th>
                        <th>가격</th>
                    </tr>
                </thead>
                <tbody>
                    {cart && cart.cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className={style.itemInfo}>
                                    <img src={item.image} alt={item.title} className={style.itemImage} />
                                    <span className={style.itemTitle}>{item.title}</span>
                                </div>
                            </td>
                            <td>{item.quantity.toLocaleString()}</td>
                            <td>{(item.quantity * item.price).toLocaleString()}원</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.orderDetail}>총 가격: {cart && cart.totalPrice.toLocaleString()}원</div>
            <div className={styles.orderDetail}>사용자 이름: {cart && cart.userName}</div>
            <div className={styles.orderDetail}>주소: {cart && cart.userAddress}</div>
            <div className={styles.orderDetail}>전화번호: {cart && cart.userPhoneNumber}</div>

            <div className={styles.addressSection}>
                <div className={styles.orderDetail}>
                    새 주소:
                    <input
                        type="text"
                        value={address}
                        readOnly
                        onChange={(e) => setAddress(e.target.value)}
                        className={styles.addressInput}
                    />
                </div>
                <button className={styles.button} onClick={() => setShowPost(true)}>
                    주소 검색
                </button>
                {showPost && (
                    <div className={styles.postcodeModal}>
                        <div className={styles.postcodeOverlay} onClick={() => setShowPost(false)}></div>
                        <div className={styles.postcodeContainer}>
                            <Post
                                setAddress={(address) => {
                                    setAddress(address);
                                    setShowPost(false);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <button className={styles.button} onClick={handlePayment}>결제하기</button>
        </div>
    );
}

export default CartOrder;
