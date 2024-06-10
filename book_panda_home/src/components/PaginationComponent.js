import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import '../styles/Pagination.module.css'; // CSS 파일 가져오기

const PaginationComponent = ({ items, itemsPerPage, renderItems }) => {
  const [activePage, setActivePage] = useState(1);

  // 현재 페이지에 표시할 데이터 계산
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div>
      <div className="items-list">
        {renderItems(currentItems)}
      </div>
      <div className="pagination-container"> 
        <Pagination 
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={items.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="pagination-item"   // 커스텀 CSS 클래스 설정
          linkClass="pagination-link"   // 커스텀 CSS 클래스 설정
          activeClass="pagination-active"   // 커스텀 CSS 클래스 설정
        />
      </div>
    </div>
  );
}

export default PaginationComponent;
