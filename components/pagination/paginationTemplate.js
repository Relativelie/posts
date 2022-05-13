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
}
