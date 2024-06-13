import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderItem from './OrderItem';
import Post from './Post';
import styles from '../styles/order.module.css';

function Order() {
    const [searchParams] = useSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(''); // 주소 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        const bookId = searchParams.get('bookId');
        if (bookId) {
            fetchBookOrder(bookId);
        }
    }, [searchParams]);

    const fetchBookOrder = async (bookId) => {
        try {
            const response = await axios.get('http://localhost:8080/bookSales/order', {
                params: { bookId },
                withCredentials: true,
            });
            setBook(response.data);
        } catch (error) {
            console.error("주문 정보 요청 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        // 결제 처리 로직
    };

    // const handleCancelOrder = async () => {
    //     try {
    //         const orderId = order.id;
    //         await axios.delete(`http://localhost:8080/api/cancel`, {
    //             params: { orderId },
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             withCredentials: true,
    //         });
    //         navigate(-1);
    //     } catch (error) {
    //         console.error('주문 취소 실패:', error);
    //     }
    // };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    return (
        <div className={styles.orderInfo}>
            {order ? (
                <>
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
                            <tr>
                                <td>
                                    <div className={styles.itemInfo}>
                                        <img src={book.image} alt={book.title} className={styles.itemImage} />
                                        <span className={styles.itemTitle}>{book.title}</span>
                                    </div>
                                </td>
                                <td>
                                    {book.quantity.toLocaleString()}
                                </td>
                                <td>{(book.discount).toLocaleString()}원</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.orderDetail}>총 가격: {order.discount.toLocaleString()}원</div>
                    <div className={styles.orderDetail}>사용자 이름: {order.userName}</div>
                    <div className={styles.orderDetail}>주소: {order.userAddress}</div>

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
                        <button
                            className={styles.button}
                            onClick={() => setShowPost(true)}
                        >
                            주소 검색
                        </button>
                        {showPost && (
                            <div className={styles.postcodeModal}>
                                <div className={styles.postcodeOverlay} onClick={() => setShowPost(false)}></div>
                                <div className={styles.postcodeContainer}>
                                    <Post setAddress={(address) => {
                                        setAddress(address);
                                        setShowPost(false);
                                    }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <button className={styles.button} onClick={handlePayment}>결제하기</button>
                    {/* <button className={styles.button} onClick={handleCancelOrder}>주문 취소</button> */}
                </>
            ) : (
                <div className={styles.errorMessage}>주문 정보를 불러올 수 없습니다.</div>
            )}
        </div>
    );
}

export default Order;
