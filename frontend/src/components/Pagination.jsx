export default function Pagination({ page, totalPages, onPrevious, onNext }) {
  const currentPage = totalPages === 0 ? 0 : page + 1;
  const onFirstPage = page <= 0;
  const onLastPage = totalPages === 0 || page >= totalPages - 1;

  return (
    <div className="pagination">
      <button
        className="btn btn--ghost"
        type="button"
        onClick={onPrevious}
        disabled={onFirstPage}
      >
        Previous
      </button>
      <p>
        Page {currentPage} of {totalPages}
      </p>
      <button
        className="btn btn--ghost"
        type="button"
        onClick={onNext}
        disabled={onLastPage}
      >
        Next
      </button>
    </div>
  );
}
