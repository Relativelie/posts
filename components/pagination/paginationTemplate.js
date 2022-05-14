export default class PaginationTemplate {
    constructor(currentPage, allPages, itemsPerPage, paginatedList) {
        this.currentPage = currentPage;
        this.allPages = allPages;
        this.itemsPerPage = itemsPerPage;
        this.paginatedList = paginatedList;
    }

    changeCurrentPage = (current) => {
        this.currentPage = current;
    };

    changePaginatedList = (data) => {
        const indexOfLastList = this.currentPage * this.itemsPerPage;
        const indexOfFirstList = indexOfLastList - this.itemsPerPage;
        const currentList = data.slice(indexOfFirstList, indexOfLastList);
        this.paginatedList = currentList;
    };

    calcListAmount = (data) => {
        const amount = Math.ceil(data.length / this.itemsPerPage);
        this.allPages = amount;
    };

    paginateItemClass = (value) => {
        const activeClass = 'pagination__number_isActive';
        const ordinaryClass = 'pagination__number';
        if (value === this.currentPage) {
            return `${ordinaryClass} ${activeClass}`;
        }
        return `${ordinaryClass}`;
    };

    calcValueForTransition = (event) => {
        const eventType = event.target.dataset.pagination;
        let value;
        if (eventType === 'next') {
            value = this.currentPage + 1;
        } else if (eventType === 'prev') {
            value = this.currentPage - 1;
        } else value = parseInt(event.target.innerText, 10);
        return value;
    };
}
