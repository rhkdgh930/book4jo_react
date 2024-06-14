import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderItem from './OrderItem';
import Post from './Post';
import styles from '../styles/order.module.css';
import style from '../styles/CartItem.module.css';

function BookSalesOrder() {
    const [searchParams] = useSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(''); // 주소 상태 추가
    const [showPost, setShowPost] = useState(false); // 팝업 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        const bookId = searchParams.get('bookId');
        console.log('bookId:', bookId);
        if (bookId) {
            fetchBookOrder(bookId);
        }
    }, [searchParams]);

    const fetchBookOrder = async (bookId) => {
        try {
            console.log('Fetching book order for bookId:', bookId);
            const response = await axios.get('http://localhost:8080/bookSales/order', {
                params: { bookId },
                withCredentials: true,
            });
            setBook(response.data);
            console.log('Book data:', response.data);
        } catch (error) {
            console.error('주문 정보 요청 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        // 결제 처리 로직
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
                    {book && (
                        <tr>
                            <td>
                                <div className={style.itemInfo}>
                                    <img src={book.image} alt={book.title} className={style.itemImage} />
                                    <span className={style.itemTitle}>{book.title}</span>
                                </div>
                            </td>
                            <td>{book.quantity.toLocaleString()}</td>
                            <td>{book.discount.toLocaleString()}원</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={styles.orderDetail}>총 가격: {book && book.discount.toLocaleString()}원</div>
            <div className={styles.orderDetail}>사용자 이름: {book && book.userName}</div>
            <div className={styles.orderDetail}>주소: {book && book.userAddress}</div>

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
            {/* <button className={styles.button} onClick={handleCancelOrder}>주문 취소</button> */}
        </div>
    );
}

export default BookSalesOrder;
