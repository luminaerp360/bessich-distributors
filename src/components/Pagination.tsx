import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
  idPrefix?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48, 96],
  itemLabel = 'products',
  className = '',
  idPrefix = 'pagination',
}) => {
  const isAll = pageSize >= totalItems && totalItems > 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / (pageSize > 0 ? pageSize : 1)));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(validCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (validCurrentPage > 3) {
        pages.push('dots-prev');
      }

      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (validCurrentPage < totalPages - 2) {
        pages.push('dots-next');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div 
      id={`${idPrefix}-container`}
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 px-2 sm:px-4 bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs text-xs ${className}`}
    >
      {/* Left side: Results Count & Page Size Selector */}
      <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          Showing <span className="font-bold text-gray-900 dark:text-white">{startIndex}–{endIndex}</span> of{' '}
          <span className="font-bold text-gray-900 dark:text-white">{totalItems}</span> {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 sm:border-l border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 text-[11px]">Per page:</span>
            <select
              id={`${idPrefix}-page-size-select`}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="bg-[#FAF9F6] dark:bg-[#12121e] border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-[11px] font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0E01B5]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              {totalItems > 48 && (
                <option value={totalItems}>All ({totalItems})</option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* First Page */}
        <button
          type="button"
          id={`${idPrefix}-first-btn`}
          onClick={() => onPageChange(1)}
          disabled={validCurrentPage === 1}
          aria-label="First page"
          title="First page"
          className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          id={`${idPrefix}-prev-btn`}
          onClick={() => onPageChange(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          aria-label="Previous page"
          title="Previous page"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1.5 py-1 text-gray-400 select-none font-bold"
                >
                  •••
                </span>
              );
            }

            const isActive = page === validCurrentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                id={`${idPrefix}-page-${page}-btn`}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[30px] h-[30px] px-2 rounded-md font-bold text-xs flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#0E01B5] text-white shadow-xs'
                    : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-200'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          id={`${idPrefix}-next-btn`}
          onClick={() => onPageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages}
          aria-label="Next page"
          title="Next page"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          id={`${idPrefix}-last-btn`}
          onClick={() => onPageChange(totalPages)}
          disabled={validCurrentPage >= totalPages}
          aria-label="Last page"
          title="Last page"
          className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
