import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import "./Pagination.css";

const Pagination = ({itemsPerPage, items, onPageChange}) => {
    const [itemOffset, setItemOffset] = useState(0);
    // console.log("items", items)
    const endOffset = itemOffset + itemsPerPage;
    // const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (e) => {
        const newOffset = (e.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        onPageChange(newOffset, itemsPerPage);
    }

    return (
        <>
            <ReactPaginate 
               breakLabel="..."
               nextLabel="next >"
               onPageChange={handlePageClick}
               pageRangeDisplayed={5}
               pageCount={pageCount}
               previousLabel="< previous"
               renderOnZeroPageCount={null} 
               containerClassName="pagination" // CSS class for the container
               pageClassName="page-item" // CSS class for each page element
               pageLinkClassName="page-link" // CSS class for the page link
               previousClassName="page-item" // CSS class for the previous button
               previousLinkClassName="page-link" // CSS class for the previous link
               nextClassName="page-item" // CSS class for the next button
               nextLinkClassName="page-link" // CSS class for the next link
               breakClassName="page-item" // CSS class for break element
               breakLinkClassName="page-link" // CSS class for break link
               activeClassName="selected" // CSS class for active page
               disabledClassName="disabled" // CSS class for disabled element
            />
        </>
    )
}

export default Pagination;