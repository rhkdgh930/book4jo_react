import { Link } from "react-router-dom";

export default function BookMain() {
  return (
    <div>
      <h1>Home</h1>
      <p>가장 먼저 보여지는 페이지입니다.</p>
      <Link to="/search">About</Link>
    </div>
  );
}