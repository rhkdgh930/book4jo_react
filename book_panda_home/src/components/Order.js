
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import OrderItem from './OrderItem';
// import styles from '../styles/CartItem.module.css';

// function Order() {
//   const location = useLocation();
//   const [orderItems, setOrderItems] = useState([]);
//   const [order, setOrder] = useState(null);
//   const [address, setAddress] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const orderId = new URLSearchParams(location.search).get('orderId');
//     fetchOrder(orderId);
//     fetchOrderItems(orderId);
//   }, [location.search]);

//   const fetchOrder = async (orderId) => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/order", {
//         params: { orderId },
//         headers: {
//           "Content-Type": "application/json"
//         },
//         withCredentials: true,
//       });
//       console.log("주문 정보 요청 성공:", response.data);
//       const orderData = response.data;
//       setOrder(orderData);

//       // 사용자의 주소 정보 설정
//       if (orderData.user) {
//         setAddress(orderData.user.address);
//         setPhoneNumber(orderData.user.phoneNumber);
//       }
//     } catch (error) {
//       console.error("주문 정보 요청 실패:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrderItems = async (orderId) => {
//     try {
//       const response = await axios.get('/api/order/items', {
//         params: { orderId },
//         headers: {
//           "Content-Type": "application/json"
//         },
//         withCredentials: true,
//       });
//       console.log("주문 항목 요청 성공:", response.data);
//       const orderItems = response.data.map(item => ({
//         ...item
//       }));
//       setOrderItems(orderItems);
//     } catch (error) {
//       console.error('주문 항목 요청 실패:', error);
//     }
//   };

//   const handlePayment = () => {
//     // 결제 처리 로직
//   };

//   return (
//     <div>
//       {order ? (
//         <>
//           <h2>주문 정보</h2>
//           <div>주문 번호: {order.id}</div>
//           <div>주문 날짜: {order.orderDate}</div>
//           <div>총 가격: {order.totalPrice.toLocaleString()}원</div>
//           <div>주소: {address}</div>
//           <div>전화번호: {phoneNumber}</div>
//           <h3>주문 상품</h3>
//           <table className={styles.orderTable}>
//             <thead>
//               <tr>
//                 <th>상품</th>
//                 <th>수량</th>
//                 <th>가격</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderItems.map((item) => (
//                 <OrderItem key={item.id} item={item} />
//               ))}
//             </tbody>
//           </table>
//           <button onClick={handlePayment}>결제하기</button>
//         </>
//       ) : (
//         <div>주문 정보를 불러올 수 없습니다.</div>
//       )}
//     </div>
//   );
// }

// export default Order;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import OrderItem from './OrderItem';
import styles from '../styles/CartItem.module.css';

function Order() {
    const location = useLocation();
    const [orderItems, setOrderItems] = useState([]);
    const [order, setOrder] = useState(null);
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 테스트 데이터 설정
        const testData = {
            id: '12345',
            orderDate: new Date().toISOString(),
            totalPrice: 25000,
            user: {
                address: '서울특별시 강남구',
                phoneNumber: '010-1234-5678'
            }
        };

        const testOrderItems = [
            { id: '1', name: '책 A', quantity: 1, price: 5000 },
            { id: '2', name: '책 B', quantity: 2, price: 10000 }
        ];

        setOrder(testData);
        setOrderItems(testOrderItems);
        setAddress(testData.user.address);
        setPhoneNumber(testData.user.phoneNumber);
        setLoading(false);

        // 실제 API 호출
        // const orderId = new URLSearchParams(location.search).get('orderId');
        // fetchOrder(orderId);
        // fetchOrderItems(orderId);
    }, [location.search]);

    // 실제 API 호출 함수들 (주석처리)
    // const fetchOrder = async (orderId) => {
    //   try {
    //     const response = await axios.get("http://localhost:8080/api/order", {
    //       params: { orderId },
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       withCredentials: true,
    //     });
    //     console.log("주문 정보 요청 성공:", response.data);
    //     const orderData = response.data;
    //     setOrder(orderData);
    // 
    //     // 사용자의 주소 정보 설정
    //     if (orderData.user) {
    //       setAddress(orderData.user.address);
    //       setPhoneNumber(orderData.user.phoneNumber);
    //     }
    //   } catch (error) {
    //     console.error("주문 정보 요청 실패:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // const fetchOrderItems = async (orderId) => {
    //   try {
    //     const response = await axios.get('/api/order/items', {
    //       params: { orderId },
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       withCredentials: true,
    //     });
    //     console.log("주문 항목 요청 성공:", response.data);
    //     const orderItems = response.data.map(item => ({
    //       ...item
    //     }));
    //     setOrderItems(orderItems);
    //   } catch (error) {
    //     console.error('주문 항목 요청 실패:', error);
    //   }
    // };

    const handlePayment = () => {
        // 결제 처리 로직
    };

    return (
        <div>
            {order ? (
                <>
                    <h3>주문 상품</h3>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>상품</th>
                                <th>수량</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                        </tbody>
                    </table>
                    <h2>주문 상품 정보</h2>
                    <div>주문 번호: {order.id}</div>
                    <div>주문 날짜: {order.orderDate}</div>
                    <div>총 가격: {order.totalPrice.toLocaleString()}원</div>
                    <div>주소: {address}</div>
                    <div>전화번호: {phoneNumber}</div>
                    <button onClick={handlePayment}>결제하기</button>
                </>
            ) : (
                <div>주문 정보를 불러올 수 없습니다.</div>
            )}
        </div>
    );
}

export default Order;