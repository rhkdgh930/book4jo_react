import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/OrderHistory.module.css';
import '../styles/Pagination.css'; // 전역 CSS 파일 임포트
import OrderItem from './OrderItem';
import Pagination from 'react-js-pagination';

function OrderHist() {
    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]); // 페이지네이션을 위한 현재 페이지 주문 데이터
    const [orderItems, setOrderItems] = useState({});
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        paginateOrders();
    }, [page, allOrders]);

    const fetchAllOrders = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await api.get('/user/orders', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            const fetchedOrders = response.data || [];
            setAllOrders(fetchedOrders);
            fetchedOrders.forEach(order => fetchOrderItems(order.id));
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const paginateOrders = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setOrders(allOrders.slice(startIndex, endIndex));
    };

    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await api.get('/order/items', {
                params: { orderId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setOrderItems(prevItems => ({
                ...prevItems,
                [orderId]: response.data,
            }));
        } catch (error) {
            console.error('주문 항목 요청 실패:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || isNaN(Date.parse(dateString))) {
            return '유효하지 않은 날짜';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleOrderDetailsClick = (orderId) => {
        navigate(`/order?orderId=${orderId}`);
    };

    return (
        <div className={styles.orderHistoryContainer}>
            <div className={styles.selectPage}>
                <div className={styles.selectPageButton}>
                    <Link to="/mypage/check">회원정보관리</Link>
                </div>
                <div className={styles.selectPageButton}>
                    <Link to="/mypage/ordered">주문내역</Link>
                </div>
            </div>
            <div className={styles.orderHistory}>
                <h2>주문 내역</h2>
                {allOrders.length === 0 ? (
                    <div className={styles.noOrders}>주문한 내역이 없습니다.</div>
                ) : (
                    <>
                        {orders.map(order => (
                            <div key={order.id} className={styles.order}>
                                <div className={styles.orderHeader}>
                                    <span className={styles.orderDate}>{formatDate(order.orderDate)} 주문</span>
                                    <button
                                        onClick={() => handleOrderDetailsClick(order.id)}
                                        className={styles.trackOrderButton}
                                    >
                                        주문 상세보기
                                    </button>
                                </div>
                                <div className={styles.orderBody}>
                                    <div className={styles.orderStatus}>{order.statusLabel}</div>
                                    <table className={styles.orderItems}>
                                        <tbody>
                                            {orderItems[order.id] ? (
                                                orderItems[order.id].map(item => (
                                                    <OrderItem key={item.id} item={item} />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">주문 항목 불러오는 중...</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className={styles.orderActions}>
                                        {/* 결제 취소 버튼 등 추가 가능 */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="pagination-container">
                            <Pagination
                                activePage={page}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={allOrders.length}
                                pageRangeDisplayed={5}
                                prevPageText={"<"}
                                nextPageText={">"}
                                onChange={handlePageChange}
                                itemClass="pagination-item" // 커스텀 CSS 클래스 설정
                                linkClass="pagination-link" // 커스텀 CSS 클래스 설정
                                activeClass="pagination-active" // 커스텀 CSS 클래스 설정
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderHist;
