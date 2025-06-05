document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchValue = searchInput.value.trim();
            if (!searchValue) {
                e.preventDefault();
                window.location.href = '/article/board';
            }
        });
    }

    // 엔터 키로 검색
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchForm.submit();
            }
        });
    }
});