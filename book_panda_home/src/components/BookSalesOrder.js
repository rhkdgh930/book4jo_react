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
    const [orderId, setOrderId] = useState(null); // orderId 상태 추가
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [deliveryType, setDeliveryType] = useState('default');
    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const bookId = searchParams.get('bookId');
        const daumPostcodeScript = document.createElement("script");

        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";

        daumPostcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        daumPostcodeScript.onload = () => setScriptLoaded(true);

        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        document.head.appendChild(daumPostcodeScript);
        if (bookId) {
            fetchBookOrder(bookId);
        }

        return () => {
            document.head.removeChild(daumPostcodeScript);
        };
    }, [searchParams]);

    const fetchBookOrder = async (bookId) => {
        try {
            const response = await axios.get('/api/bookSales/order', {
                params: { bookId },
                withCredentials: true,
            });
            const bookData = response.data;
            setBook(bookData);
            setAddress(bookData.userAddress1);
            setDetailedAddress(bookData.userAddress2);
            setPostCode(bookData.userPostCode);
        } catch (error) {
            console.error('주문 정보 요청 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostcode = (e) => {
        e.preventDefault();
        if (!scriptLoaded) {
            setErrors({ ...errors, address: '주소 검색 스크립트가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.' });
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address + (data.buildingName ? `, ${data.buildingName}` : ""));
                setPostCode(data.zonecode);
            },
        }).open();
    };

    const handlePayment = async () => {
        setLoading(true);

        const { IMP } = window;
        if (!IMP) {
            console.error('IAMPORT가 로드되지 않았습니다.');
            setLoading(false);
            return;
        }

        if (!book || book.totalPrice <= 0) {
            console.error('Invalid total price:', book.totalPrice);
            setError('Invalid total price.');
            setLoading(false);
            return;
        }

        IMP.init('imp14170881');

        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: `merchant_${new Date().getTime()}`,
            name: book.productName,
            amount: book.discount,
            buyer_email: book.userEmail,
            buyer_name: book.name,
            buyer_tel: book.userPhoneNumber,
            buyer_addr: address,
            buyer_postcode: postCode,
        }, async (rsp) => {
            if (rsp.success) {
                try {
                    const { data } = await axios.post('/api/payment/verify/' + rsp.imp_uid);
                    if (rsp.paid_amount === data.amount) {
                        const paymentData = {
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            amount: rsp.paid_amount,
                            buyerEmail: book.userEmail,
                            buyerName: book.userName,
                            buyerTel: book.userPhoneNumber,
                            buyerAddr: address,
                            buyerPostcode: postCode,
                            status: rsp.status,
                        };

                        await axios.post('/api/payment/save', paymentData);

                        setPaymentInfo({
                            product_name: book.productName,
                            amount: rsp.paid_amount,
                            buyer_email: book.userEmail,
                            buyer_name: book.name,
                            buyer_tel: book.userPhoneNumber,
                            buyer_addr: address,
                            buyer_postcode: postCode,
                        });
                        setError(null);
                        alert('결제 성공');
                    } else {
                        setError('결제 검증 실패: 금액이 일치하지 않습니다.');
                        alert('결제 실패');
                    }
                } catch (error) {
                    console.error('결제 검증 및 저장 중 오류 발생:', error);
                    setError('결제 검증 및 저장 중 오류가 발생했습니다.');
                    alert('결제 실패');
                }
            } else {
                setError(`결제에 실패하였습니다: ${rsp.error_msg}`);
                alert('결제 실패');
              }
            });

        const bookId = searchParams.get('bookId');
        try {
            const getKoreanDate = () => {
                const date = new Date();
                const offset = 9 * 60; // 한국 시간은 UTC+9
                const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
                return koreanDate;
            };

            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const requestData = {
                bookId: bookId,
                orderDate: getKoreanDate(),
                address1: address,
                address2: detailedAddress,
                postCode: postCode,
            };
            console.log(requestData);
            const response = await axios.post(`/api/order`, requestData, {
                params: { id: bookId },
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log("orderId : ", response.data.id);
            setOrderId(response.data.id);
        } catch (error) {
            console.error("주문 오류: ", bookId, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            console.log("Updated orderId : ", orderId);
        }
    }, [orderId]);



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
            <div className={styles.orderDetail}>주소: {book && book.userAddress1} {book && book.userAddress2}</div>

            <div>
                <label>
                    <input
                        type="radio"
                        value="default"
                        checked={deliveryType === 'default'}
                        onChange={() => {
                            setDeliveryType('default');
                            setAddress(book.userAddress1);
                            setDetailedAddress(book.userAddress2);
                            setPostCode(book.userPostCode);
                        }}
                    />
                    기본 배송지
                </label>
                <label>
                    <input
                        type="radio"
                        value="new"
                        checked={deliveryType === 'new'}
                        onChange={() => {
                            setDeliveryType('new');
                            setAddress('');
                            setDetailedAddress('');
                            setPostCode('');
                        }}
                    />
                    새 배송지
                </label>
            </div>

            {deliveryType === 'default' ? (
                <div className={styles.addressInfo}>
                    <div>주소: {address}</div>
                    <div>상세 주소: {detailedAddress}</div>
                    <div>우편번호: {postCode}</div>
                </div>
            ) : (
                <div>
                    <div className="address-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            placeholder="주소를 검색해주세요."
                            defaultValue={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button onClick={handlePostcode}>주소 검색</button>
                    </div>
                    <input
                        placeholder="상세 주소를 입력해주세요."
                        defaultValue={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                    />
                    <div className="custom-text">우편번호</div>
                    <input
                        placeholder="우편번호"
                        defaultValue={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                    />
                </div>
            )}

            <button className={styles.button} onClick={handlePayment}>결제하기</button>
        </div>
    );
}

export default BookSalesOrder;
