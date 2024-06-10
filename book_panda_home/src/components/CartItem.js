import React from "react";
import styles from '../styles/CartItem.module.css';

function CartItem({ item, onQuantityChange, onCheckChange, onRemove }) {

    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onCheckChange(item.id)}
                />
            </td>
            <td>
                <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.title} className={styles.itemImage}/>
                    <span className={styles.itemTitle}>{item.title}</span>
                </div>
            </td>
            <td>
                <input
                    type="number"
                    value={item.quantity}
                    onChange={(event) => onQuantityChange(item.id, event.target.value)}
                    min="1"
                    className={styles.quantityInput}
                />
            </td>
            <td>{(item.price * item.quantity).toLocaleString()}원</td>
            <td>
                <button className={styles.deleteButton} onClick={onRemove}>삭제</button>
            </td>
        </tr>
    );
}

export default CartItem;