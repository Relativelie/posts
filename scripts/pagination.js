export default class Pagination {
    constructor(currentPage, allPages, itemsPerPage, paginatedList) {
        this.currentPage = currentPage;
        this.allPages = allPages;
        this.itemsPerPage = itemsPerPage;
        this.paginatedList = paginatedList;
    }

    static range(start, end) {
        return Array(end - start + 1)
            .fill(undefined)
            .map((_, idx) => start + idx);
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
}
