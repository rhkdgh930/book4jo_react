import React from "react"

const Notification = ({message, onClose, onNavigate}) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <p>{message}</p>
                <button style={styles.button} onClick={onClose}>확인</button>
                <button style={styles.button} onClick={onNavigate}>장바구니로 이동</button>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        zIndex: 1001,
    },
    button: {
        margin: "0 5px",
    },
};

export default Notification;
