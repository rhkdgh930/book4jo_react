import React, { useEffect, useState } from 'react';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from '../styles/order.module.css';
import style from '../styles/CartItem.module.css';

function BookSalesOrder() {
    const [searchParams] = useSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
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
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
            document.head.removeChild(daumPostcodeScript);
        };
    }, [searchParams]);

    const fetchBookOrder = async (bookId) => {
        try {
            const response = await api.get('/bookSales/order', {
                params: { bookId },
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                withCredentials: true,
            });
            const bookData = response.data;
            setBook(bookData);
            setAddress(bookData.userAddress1);
            setDetailedAddress(bookData.userAddress2);
            setPostCode(bookData.userPostCode);
            setUserName(bookData.userName);
            setPhoneNumber(bookData.userPhoneNumber);
        } catch (error) {
            console.error('주문 정보 요청 실패:', error);
            setError('주문 정보를 불러오는 중 오류가 발생했습니다.');
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

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        } else {
            return text;
        }
    };

    const fetchToken = async () => {
        const MAX_RETRIES = 10; // 최대 재시도 횟수
        const RETRY_DELAY = 1000; // 지연 시간 (밀리초 단위)
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            try {
                const tokenResponse = await api.post(`/payment/token`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    }
                });
                const { access_token } = tokenResponse.data;
                return access_token;
            } catch (error) {
                console.error('토큰 요청 실패:', error);
                retryCount++;
                if (retryCount === MAX_RETRIES) {
                    throw new Error('토큰을 받아오는 데 실패했습니다.');
                }
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    };

    const cancelPayment = async (impUid, merchantUid, amount) => {
        try {
            const token = await fetchToken();

            const cancelData = {
                reason: '결제 검증 실패 또는 오류 발생으로 인한 자동 취소',
                imp_uid: impUid,
                merchant_uid: merchantUid,
                amount: amount,
                access_token: token
            };

            console.log('결제 취소 요청 중...', cancelData);

            await api.post(`/payment/cancel`, cancelData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                withCredentials: true,
            });

            console.log('결제가 취소되었습니다.');
        } catch (error) {
            console.error('결제 취소 중 오류 발생:', error);
            setError('결제 취소 중 오류가 발생했습니다.');
        }
    };

    const getKoreanDate = () => {
        const date = new Date();
        const offset = 9 * 60; // 한국 시간은 UTC+9
        const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
        return koreanDate;
    };

    const handlePayment = async () => {
        setLoading(true);

        const { IMP } = window;
        if (!IMP) {
            console.error('IAMPORT가 로드되지 않았습니다.');
            setLoading(false);
            return;
        }

        IMP.init('본인꺼 사용해야함');

        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: `merchant_${new Date().getTime()}`,
            name: book.title,
            amount: book.discount,
            buyer_email: book.userEmail,
            buyer_name: book.userName,
            buyer_tel: book.userPhoneNumber,
            buyer_addr: address,
            buyer_postcode: postCode,
        }, async (rsp) => {
            if (rsp.success) {
                try {
                    const { data } = await api.post('/payment/verify/' + rsp.imp_uid);
                    if (rsp.paid_amount === data.amount) {
                        const payment_token = await fetchToken(); // 토큰 요청 함수 호출
                        const token = localStorage.getItem('accessToken');
                        if (!token) {
                            throw new Error('No access token found');
                        }
                        const bookId = searchParams.get('bookId');

                        const orderData = {
                            orderDate: getKoreanDate(),
                        };

                        const shippingData = {
                            address1: address,
                            address2: detailedAddress,
                            payDoneDate: getKoreanDate(),
                            postCode: postCode,
                            shippingUserName: userName,
                            phoneNumber: phoneNumber,
                        };

                        const orderResponse = await api.post(`/order`, orderData, {
                            params: { id: bookId },
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        });

                        const shippingResponse = await api.post(`/shipping`, shippingData, {
                            params: { orderId: orderResponse.data.id },
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            withCredentials: true,
                        });

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
                            orderId: orderResponse.data.id,
                        };

                        await api.post(`/payment/save`, paymentData, {
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        });

                        setPaymentInfo({
                            product_name: book.productName,
                            amount: rsp.paid_amount,
                            buyer_email: book.userEmail,
                            buyer_name: book.userName,
                            buyer_tel: book.userPhoneNumber,
                            buyer_addr: address,
                            buyer_postcode: postCode,
                        });
                        setError(null);
                        alert('결제 성공');
                        navigate(`/order?orderId=${orderResponse.data.id}`);
                    } else {
                        setError('결제 검증 실패: 금액이 일치하지 않습니다.');
                        await cancelPayment(rsp.imp_uid, rsp.merchant_uid, rsp.paid_amount); // 결제 취소
                        alert('결제가 실패하였습니다, 잠시 후 다시 시도해주세요.');
                    }
                } catch (error) {
                    console.error('결제 검증 및 저장 중 오류 발생:', error);
                    setError('결제 검증 및 저장 중 오류가 발생했습니다.');
                    await cancelPayment(rsp.imp_uid, rsp.merchant_uid, rsp.paid_amount); // 결제 취소
                    alert('결제가 실패하였습니다, 잠시 후 다시 시도해주세요.');
                }
            } else {
                setError(`결제에 실패하였습니다: ${rsp.error_msg}`);
                alert('결제가 실패하였습니다, 잠시 후 다시 시도해주세요.');
            }
            setLoading(false);
        });
    };

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
                                    <span className={style.itemTitle}>{truncateText(book.title, 40)}</span>
                                </div>
                            </td>
                            <td>{book.quantity.toLocaleString()}</td>
                            <td>{book.discount.toLocaleString()}원</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={styles.orderDetail}>총 가격: {book && book.discount.toLocaleString()}원</div>
            <h3 className={styles.subheading}>배송지 정보 입력</h3>
            <table className={styles.addressTable}>
                <tbody>
                    <tr>
                        <th>받으시는 분</th>
                        <td>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>
                            <div className={styles.addressInputWrapper}>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="주소를 입력해주세요."
                                    readOnly
                                />
                                <button onClick={handlePostcode}>주소 검색</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>상세 주소</th>
                        <td>
                            <input
                                type="text"
                                value={detailedAddress}
                                onChange={(e) => setDetailedAddress(e.target.value)}
                                placeholder="상세 주소를 입력해주세요."
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>우편번호</th>
                        <td>
                            <input
                                type="text"
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                                placeholder="우편번호를 입력해주세요."
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>휴대전화번호</th>
                        <td>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button className={styles.button} onClick={handlePayment}>결제하기</button>
        </div>
    );
}

export default BookSalesOrder;