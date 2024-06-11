import React from "react";
import styles from '../styles/CartItem.module.css';

function OrderItem({ item }) {

    return (
        <tr>
            <td>
                <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                    <span className={styles.itemTitle}>{item.title}</span>
                </div>
            </td>
            <td>
                {item.quantity.toLocaleString()}
            </td>
            <td>{(item.price * item.quantity).toLocaleString()}원</td>
        </tr>
    );
}

export default OrderItem;