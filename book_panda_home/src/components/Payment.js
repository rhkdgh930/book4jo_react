import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Payment.module.css";

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(0);
  const [productName, setProductName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerAddr, setBuyerAddr] = useState("");
  const [buyerPostcode, setBuyerPostcode] = useState("");

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    const daumPostcode = document.createElement("script");
    daumPostcode.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    document.head.appendChild(daumPostcode);

    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
      document.head.removeChild(daumPostcode);
    };
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const requestPay = () => {
    const { IMP } = window;
    IMP.init("imp14170881"); // 상점 식별코드

//    if (!validateEmail(buyerEmail)) {
//      setError("올바른 이메일 주소를 입력하세요.");
//      return;
//    }
//
//    if (!validatePhoneNumber(buyerTel)) {
//      setError("올바른 전화번호를 입력하세요.");
//      return;
//    }

    IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `merchant_${new Date().getTime()}`,
        name: productName,
        amount: amount,
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        buyer_tel: buyerTel,
        buyer_addr: buyerAddr,
        buyer_postcode: buyerPostcode,
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            const { data } = await axios.post("/api/api/payment/verify/" + rsp.imp_uid);
            if (rsp.paid_amount === data.amount) {
              const paymentData = {
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                amount: rsp.paid_amount,
                buyerEmail: buyerEmail,
                buyerName: buyerName,
                buyerTel: buyerTel,
                buyerAddr: buyerAddr,
                buyerPostcode: buyerPostcode,
                status: rsp.status,
                //orderId: 1 // 이 부분은 실제 주문 ID로 대체
              };

              await axios.post("/api/api/payment/save", paymentData);

              setPaymentInfo({
                product_name: productName,
                amount: rsp.paid_amount,
                buyer_email: buyerEmail,
                buyer_name: buyerName,
                buyer_tel: buyerTel,
                buyer_addr: buyerAddr,
                buyer_postcode: buyerPostcode,
              });
              setError(null);
              alert("결제 성공");
            } else {
              setError("결제 검증 실패: 금액이 일치하지 않습니다.");
              alert("결제 실패");
            }
          } catch (error) {
            console.error("Error while verifying and saving payment:", error);
            setError("결제 검증 및 저장 중 오류가 발생했습니다.");
            alert("결제 실패");
          }
        } else {
          setError(`결제에 실패하였습니다: ${rsp.error_msg}`);
          alert("결제 실패");
        }
      }
    );
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setBuyerAddr(data.address + (data.buildingName ? `, ${data.buildingName}` : ""));
        setBuyerPostcode(data.zonecode);
      },
    }).open();
  };

  return (
    <div className={styles.PaymentContainer}>
      {!paymentInfo ? (
        <>
          <h1>결제하기</h1>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>상품명: </label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>결제 금액: </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value > 0 ? Number(e.target.value) : 0)}
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label>이메일: </label>
              <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>주문인: </label>
              <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>휴대전화번호: </label>
              <input type="tel" value={buyerTel} onChange={(e) => setBuyerTel(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>주소: </label>
              <div className={styles.addressInputContainer}>
                <input type="text" value={buyerAddr} readOnly className={styles.addressInput} />
                <button type="button" onClick={handlePostcode} className={styles.addressButton}>
                  주소 검색
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>우편번호: </label>
              <input type="text" value={buyerPostcode} readOnly className={styles.addressInput} />
            </div>
            <button type="button" className={styles.button} onClick={requestPay}>
              결제하기
            </button>
          </form>
        </>
      ) : (
        <div className={styles.paymentResult}>
          <h3>결제 정보</h3>
          <p>
            <strong>상품명:</strong> {paymentInfo.product_name}
          </p>
          <p>
            <strong>결제 금액:</strong> {paymentInfo.amount}
          </p>
          <p>
            <strong>이메일:</strong> {paymentInfo.buyer_email}
          </p>
          <p>
            <strong>구매자 이름:</strong> {paymentInfo.buyer_name}
          </p>
          <p>
            <strong>구매자 전화번호:</strong> {paymentInfo.buyer_tel}
          </p>
          <p>
            <strong>구매자 주소:</strong> {paymentInfo.buyer_addr}
          </p>
          <p>
            <strong>우편번호:</strong> {paymentInfo.buyer_postcode}
          </p>
        </div>
      )}
      {error && (
        <div className={styles.errorInfo}>
          <h3>결제 오류</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
