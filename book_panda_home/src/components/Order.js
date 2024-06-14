// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import OrderItem from './OrderItem';
// import styles from '../styles/order.module.css'; // Ensure this path is correct

// function Order() {
//     const [searchParams] = useSearchParams();
//     const [orderItems, setOrderItems] = useState([]);
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const orderId = searchParams.get('orderId');
//         console.log("search : ", orderId);

//         if (orderId) {
//             fetchOrder(orderId);
//             fetchOrderItems(orderId);
//         }
//     }, [searchParams]);

//     const fetchOrder = async (orderId) => {
//         try {
//             const response = await axios.get('http://localhost:8080/api/order', {
//                 params: { orderId },
//                 withCredentials: true,
//             });
//             console.log("주문 정보 요청 성공:", response.data);
//             setOrder(response.data);
//         } catch (error) {
//             console.error("주문 정보 요청 실패:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchOrderItems = async (orderId) => {
//         try {
//             const token = localStorage.getItem('accessToken');
//             if (!token) {
//                 throw new Error('No access token found');
//             }
//             const response = await axios.get('http://localhost:8080/api/order/items', {
//                 params: { orderId },
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 withCredentials: true,
//             });
//             console.log("주문 항목 요청 성공:", response.data);
//             const orderItems = Array.isArray(response.data) ? response.data.map(item => ({
//                 ...item
//             })) : [];
//             setOrderItems(orderItems);
//         } catch (error) {
//             console.error('주문 항목 요청 실패:', error);
//         }
//     };

//     const handlePayment = () => {
//         // 결제 처리 로직
//     };

//     const handleCancelOrder = async () => {
//         try {
//             const orderId = order.id;
//             await axios.delete(`http://localhost:8080/api/cancel`, {
//                 params: { orderId },
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 withCredentials: true,
//             });
//             console.log("주문이 취소되었습니다.");
//             navigate(-1);
//         } catch (error) {
//             console.error('주문 취소 실패:', error);
//         }
//     };

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
//         return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
//     };

//     return (
//         <div className={styles.orderInfo}>
//             {order ? (
//                 <>
//                     <h2 className={styles.heading}>주문 정보</h2>
//                     <h3 className={styles.subheading}>주문 상품</h3>
//                     <table className={styles.orderTable}>
//                         <thead>
//                             <tr>
//                                 <th>상품</th>
//                                 <th>수량</th>
//                                 <th>가격</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orderItems.map((item) => (
//                                 <OrderItem key={item.id} item={item} />
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className={styles.orderDetail}>주문 번호: {order.id}</div>
//                     <div className={styles.orderDetail}>주문 날짜: {formatDate(order.orderDate)}</div>
//                     <div className={styles.orderDetail}>총 가격: {order.totalPrice.toLocaleString()}원</div>
//                     <div className={styles.orderDetail}>사용자 이름: {order.userName}</div>
//                     <div className={styles.orderDetail}>주소: {order.userAddress}</div>
//                     <div></div>
//                     <button className={styles.button} onClick={handlePayment}>결제하기</button>
//                     <button className={styles.button} onClick={handleCancelOrder}>주문 취소</button>
//                 </>
//             ) : (
//                 <div className={styles.errorMessage}>주문 정보를 불러올 수 없습니다.</div>
//             )}
//         </div>
//     );
// }

// export default Order;
