import React from "react";
import styles from '../styles/CartItem.module.css';

function OrderItem({ item }) {
    return (
        <tr className={styles.orderItemRow}>
            <td>
                <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                    <div>
                        <div className={styles.itemTitle}>{item.title}</div>
                        <div className={styles.itemPrice}>{item.price.toLocaleString()}원</div>
                    </div>
                </div>
            </td>
            {/* <td>
                {item.quantity.toLocaleString()} 개
            </td>
            <td>
                {(item.price * item.quantity).toLocaleString()}원
            </td> */
            }
        </tr>
    );
}

export default OrderItem;
