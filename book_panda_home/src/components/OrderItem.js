import React from "react";
import styles from '../styles/OrderItem.module.css';

function OrderItem({ item }) {
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        } else {
            return text;
        }
    };

    console.log(item);

    return (
        <tr className={styles.orderItemRow}>
            <td className={styles.item}>
                <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                    <div>
                        <a href={`/bookSalesDetail?id=${item.bookId}`} className={styles.itemTitle}>{truncateText(item.title, 30)}</a>
                    </div>
                </div>
            </td>
            <td className={styles.itemQuantity}>
                {item.quantity.toLocaleString()} 개
            </td>
            <td className={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString()}원
            </td>
        </tr>
    );
}

export default OrderItem;
