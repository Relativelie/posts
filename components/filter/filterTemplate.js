export default class FilterTemplate {
    constructor(filteredList, activeFilter, isFiltered) {
        this.filteredList = filteredList;
        this.activeFilter = activeFilter;
        this.isFiltered = isFiltered;
    }

    allFilters = [
        { id: 1, attributeName: 'id', headName: 'ID' },
        { id: 2, attributeName: 'title', headName: 'Заголовок' },
        { id: 3, attributeName: 'body', headName: 'Описание' },
    ];

    turnOnFilter = (data, filterBy) => {
        const defaultFilter = 'id';
        const filteredItems = [...data];
        const filteringFlag = filterBy.length !== 0 ? filterBy : defaultFilter;
        if (filteredItems.length !== 0) {
            if (!Number.isNaN(parseInt(filteredItems[0][filteringFlag], 10))) {
                filteredItems.sort(
                    (first, second) => first[filteringFlag] - second[filteringFlag],
                );
            } else {
                filteredItems.sort(
                    (first, second) => first[filteringFlag].localeCompare(second[filteringFlag]),
                );
            }
        }
        this.filteredList = filteredItems;
        this.activeFilter = filterBy;
        this.isFiltered = true;
    };

    turnOffFilter = () => {
        this.filteredList = [];
        this.activeFilter = '';
        this.isFiltered = false;
    };
}
