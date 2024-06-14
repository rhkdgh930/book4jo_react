// import React from "react";
// import DaumPostcode from "react-daum-postcode";
// import styles from '../styles/post.module.css';

// const Post = ({ setAddress }) => {

//     const complete = (data) => {
//         let fullAddress = data.address;
//         let extraAddress = '';

//         if (data.addressType === 'R') {
//             if (data.bname !== '') {
//                 extraAddress += data.bname;
//             }
//             if (data.buildingName !== '') {
//                 extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
//             }
//             fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
//         }
//         setAddress(fullAddress);
//     }

//     return (
//         <div className={styles.postcodeWrapper}>
//             <DaumPostcode
//                 className={styles.postcode}
//                 autoClose
//                 onComplete={complete}
//             />
//         </div>
//     );
// };

// export default Post;
