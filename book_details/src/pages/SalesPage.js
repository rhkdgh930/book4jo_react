import { Link } from "react-router-dom";
import BookSales from "../components/BookSales";

export default function SalesPage({book}) {
  return (
    <div>
      <h1>Sales</h1>
      <p>책 판매 페이지입니다.</p>
      <BookSales book = {book}></BookSales>
    </div>
  );
}